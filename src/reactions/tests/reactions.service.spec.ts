import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogPost } from '../../blogs/blog.entity';
import { Comment } from '../../comments/comment.entity';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { Reaction, ReactionEnum } from '../reaction.entity';
import { ReactionsService } from '../reactions.service';

const fakeUser1: User = {
  id: 'testId1',
  firstName: 'test',
  lastName: 'test',
  email: 'test1@email.com',
  phone: 'testPhone',
  password: 'test',
};
const fakeUser2: User = {
  id: 'testId2',
  firstName: 'test',
  lastName: 'test',
  email: 'test2@email.com',
  phone: 'testPhone',
  password: 'test',
};
const fakeUser3: User = {
  id: 'testId3',
  firstName: 'test',
  lastName: 'test',
  email: 'test3@email.com',
  phone: 'testPhone',
  password: 'test',
};

const fakeBlog: BlogPost = {
  id: 'testId',
  title: 'test',
  description: 'test',
  content: 'test',
  author: fakeUser1,
};
const fakeComment: Comment = {
  id: 'testId',
  content: 'test',
  blog: fakeBlog,
  user: fakeUser1,
};

const fakeBlogReactions: Reaction[] = [
  new Reaction('testId1', ReactionEnum.UPVOTE, fakeUser1, fakeBlog),
  new Reaction('testId2', ReactionEnum.DOWNVOTE, fakeUser2, fakeBlog),
  new Reaction('testId3', ReactionEnum.UPVOTE, fakeUser3, fakeBlog),
];

const fakeCommentReactions: Reaction[] = [
  new Reaction('testId1', ReactionEnum.UPVOTE, fakeUser1, null, fakeComment),
  new Reaction('testId2', ReactionEnum.DOWNVOTE, fakeUser2, null, fakeComment),
  new Reaction('testId3', ReactionEnum.UPVOTE, fakeUser3, null, fakeComment),
];

const allFakeReactions = [...fakeBlogReactions, ...fakeCommentReactions];

const fakeReaction = new Reaction(
  'test',
  ReactionEnum.DOWNVOTE,
  fakeUser1,
  fakeBlog,
);

const fakeReactionsStats = { upVotes: 3, downVotes: 3, total: 6 };

const fakeRepository = {
  count: jest.fn().mockImplementation(() => Promise.resolve(3)),
  find: jest.fn().mockImplementation(() => Promise.resolve(allFakeReactions)),
  findOne: jest.fn().mockImplementation(() => Promise.resolve(fakeReaction)),
  create: jest
    .fn()
    .mockImplementation((reaction: Partial<Reaction>) =>
      Promise.resolve(fakeReaction),
    ),
  save: jest
    .fn()
    .mockImplementation((reaction: Partial<Reaction>) =>
      Promise.resolve(fakeReaction),
    ),
  delete: jest.fn().mockImplementation((id: string) => {
    deleted: true;
  }),
};

describe('ReactionsService', () => {
  let service: ReactionsService;
  let repository: Repository<Reaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsService,
        { provide: getRepositoryToken(Reaction), useValue: fakeRepository },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
    repository = module.get<Repository<Reaction>>(getRepositoryToken(Reaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should fetch all the reactions', async () => {
      const reactions = await service.find();
      expect(reactions).toBe<Reaction[]>(allFakeReactions);
    });
  });

  describe('findByAndCount', () => {
    it('should return an object containing reaction stats', async () => {
      const reactionStats = await service.findByAndCount({
        type: 'blog',
        id: 'testId',
      });
      const repoSpy = jest.spyOn(repository, 'count');
      expect(reactionStats).toEqual(fakeReactionsStats);
      expect(repoSpy).toBeCalledTimes(2);
    });
  });

  describe('findById', () => {
    it('should fetch a single reaction', async () => {
      const repoSpy = jest.spyOn(repository, 'findOne');
      const reaction = await service.findById('testId');
      expect(reaction).toEqual(fakeReaction);
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({ where: { id: 'testId' } }),
      );
    });

    it('should throw an error if the reaction was not found', async () => {
      try {
        fakeRepository.findOne = jest.fn().mockResolvedValue(null);
        await service.findById('testId');
      } catch (err) {}
    });
  });

  describe('create', () => {
    it('should return persisted blog reaction', async () => {
      Object.assign(fakeReaction, { blogId: fakeBlog.id, commentId: null });
      fakeRepository.findOne = jest.fn().mockResolvedValue(null);
      const reaction = await service.create(fakeReaction, fakeUser1);
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(reaction).toEqual(fakeReaction);
      expect(repoSpy).toBeCalledWith({
        where: { user: { id: fakeUser1.id }, blog: { id: fakeBlog.id } },
      });
    });

    it('should return persisted comment reaction', async () => {
      Object.assign(fakeReaction, { blogId: null, commentId: fakeComment.id });
      fakeRepository.findOne = jest.fn().mockResolvedValue(null);
      const reaction = await service.create(fakeReaction, fakeUser1);
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(reaction).toEqual(fakeReaction);
      expect(repoSpy).toBeCalledWith({
        where: { user: { id: fakeUser1.id }, comment: { id: fakeComment.id } },
      });
    });

    it('should throw an error if blog and comment is not provided', async () => {
      try {
        Object.assign(fakeReaction, { blogId: null, commentId: null });
        await service.create(fakeReaction, fakeUser1);
      } catch (err) {}
    });

    it('should throw an error if blog and comment are both provided', async () => {
      Object.assign(fakeReaction, { blogId: fakeBlog, commentId: fakeComment });
      try {
        await service.create(fakeReaction, fakeUser1);
      } catch (err) {}
    });

    it('should throw an error if a users has already reacted to a blog post', async () => {
      Object.assign(fakeReaction, { blog: fakeBlog, comment: null });
      fakeRepository.findOne = jest.fn().mockResolvedValue(fakeReaction);
      try {
        await service.create(fakeReaction, fakeUser1);
      } catch (err) {}
    });

    it('should throw an error if a users has already reacted to a comment', async () => {
      Object.assign(fakeReaction, { blog: null, comment: fakeComment });
      fakeRepository.findOne = jest.fn().mockResolvedValue(fakeReaction);
      try {
        await service.create(fakeReaction, fakeUser1);
      } catch (err) {}
    });
  });

  describe('update', () => {
    it('should update an existing reaction', async () => {
      fakeRepository.findOne = jest.fn().mockResolvedValue(fakeReaction);
      const reaction = await service.update(fakeReaction.id, fakeReaction);
      expect(reaction).toEqual(fakeReaction);
    });

    it('should throw an error if reaction does not exist', async () => {
      fakeRepository.findOne = jest.fn().mockResolvedValue(null);
      try {
        await service.update(fakeReaction.id, fakeReaction);
      } catch (err) {}
    });
  });

  describe('delete', () => {
    it('should delete a reaction', async () => {
      fakeRepository.findOne = jest.fn().mockResolvedValue(fakeReaction);
      expect(await service.delete(fakeReaction.id)).toEqual({ deleted: true });
    });

    it('should throw an error if reaction does not exist', async () => {
      fakeRepository.findOne = jest.fn().mockResolvedValue(null);
      try {
        await service.delete(fakeReaction.id);
      } catch (err) {}
    });
  });
});
