import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/user.entity';
import { EditReactionDto } from '../dtos/edit-reaction.dto';
import { Reaction, ReactionEnum } from '../reaction.entity';
import { ReactionsController } from '../reactions.controller';
import { ReactionsService } from '../reactions.service';

const fakeUser: User = {
  id: 'testId1',
  firstName: 'test',
  lastName: 'test',
  email: 'test1@email.com',
  phone: 'testPhone',
  password: 'test',
};

const fakeReaction = new Reaction('testId', ReactionEnum.DOWNVOTE, fakeUser);

const fakeReactionCountStats = { upVotes: 3, downVotes: 3, count: 6 };

const fakeService = {
  find: jest.fn().mockResolvedValue([fakeReaction]),
  findByAndCount: jest.fn().mockResolvedValue(fakeReactionCountStats),
  findById: jest
    .fn()
    .mockImplementation((id: string) => Promise.resolve(fakeReaction)),
  create: jest
    .fn()
    .mockImplementation((reaction: Reaction, user: User) =>
      Promise.resolve(fakeReaction),
    ),
  update: jest
    .fn()
    .mockImplementation((id: string, attrs: EditReactionDto) =>
      Promise.resolve({ ...fakeReaction, ...attrs }),
    ),
  delete: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      deleted: true,
    }),
  ),
};

describe('ReactionsController', () => {
  let controller: ReactionsController;
  let service: ReactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ReactionsService, useValue: fakeService }],
      controllers: [ReactionsController],
    }).compile();

    controller = module.get<ReactionsController>(ReactionsController);
    service = module.get<ReactionsService>(ReactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReactions', () => {
    it('should fetch a list of all the reactions', async () => {
      const reactions = await controller.getReactions();
      expect(reactions).toEqual([fakeReaction]);
    });
  });

  describe('getBlogReactionsCount', () => {
    it('should fetch a blog post reaction stats', async () => {
      const serviceSpy = jest.spyOn(service, 'findByAndCount');
      const reactionStats = await controller.getBlogReactionsCount('testId');
      expect(reactionStats).toEqual(fakeReactionCountStats);
      expect(serviceSpy).toBeCalledWith({ type: 'blog', id: 'testId' });
    });
  });

  describe('getCommentReactionsCount', () => {
    it('should fetch a comment reaction stats', async () => {
      const serviceSpy = jest.spyOn(service, 'findByAndCount');
      const reactionStats = await controller.getCommentReactionsCount('testId');
      expect(reactionStats).toEqual(fakeReactionCountStats);
      expect(serviceSpy).toBeCalledWith({ type: 'comment', id: 'testId' });
    });
  });

  describe('getReaction', () => {
    it('should fetch a single reaction', async () => {
      const serviceSpy = jest.spyOn(service, 'findById');
      const reaction = await controller.getReaction(fakeReaction.id);
      expect(reaction).toEqual(fakeReaction);
      expect(serviceSpy).toBeCalledWith(fakeReaction.id);
    });
  });

  describe('createReaction', () => {
    it('should create a reaction', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      const reaction = await controller.createReaction(fakeReaction, fakeUser);
      expect(reaction).toEqual(fakeReaction);
      expect(serviceSpy).toBeCalledWith(fakeReaction, fakeUser);
    });
  });

  describe('editReaction', () => {
    it('should edit a reaction', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      const reaction = await controller.editReaction(
        fakeReaction.id,
        fakeReaction,
      );
      expect(reaction).toEqual(fakeReaction);
      expect(serviceSpy).toBeCalledWith(fakeReaction.id, fakeReaction);
    });
  });

  describe('deleteReaction', () => {
    it('should delete a reaction', async () => {
      const serviceSpy = jest.spyOn(service, 'delete');
      expect(await controller.deleteReaction(fakeReaction.id)).toEqual({
        deleted: true,
      });
      expect(serviceSpy).toBeCalledWith(fakeReaction.id);
    });
  });
});
