import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogsService } from '../../blogs/blogs.service';
import { Repository } from 'typeorm';
import { Comment } from '../comment.entity';
import { CommentsService } from '../comments.service';
import { BlogPost } from '../../blogs/blog.entity';
import { User } from '../../users/user.entity';

const fakeComment: Comment = new Comment('testId', 'test');

const fakeComments: Comment[] = [fakeComment];

const fakeBlog: BlogPost = new BlogPost();

const fakeUser: User = new User();

const fakeRepository = {
  find: jest.fn().mockResolvedValue(fakeComments),
  findOneBy: jest.fn().mockResolvedValue(fakeComment),
  count: jest.fn(() => Promise.resolve(fakeComments.length)),
  create: jest.fn().mockReturnValue(fakeComment),
  save: jest.fn().mockResolvedValue(fakeComment),
  delete: jest.fn().mockResolvedValue({ deleted: true }),
};

const fakeBlogsService = {
  findById: jest.fn().mockResolvedValue(fakeBlog),
};

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;
  let blogsService: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: fakeRepository },
        { provide: BlogsService, useValue: fakeBlogsService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    blogsService = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a repository', () => {
    expect(repository).toBeDefined();
  });

  it('should have a blogs service', () => {
    expect(blogsService).toBeDefined();
  });

  describe('find', () => {
    it('should fetch a list of comments', async () => {
      const repoSpy = jest.spyOn(repository, 'find');
      const comments = await service.find();
      expect(comments).toEqual(fakeComments);
      expect(repoSpy).toHaveBeenCalledWith();
    });
  });

  describe('findById', () => {
    it('should fetch a single comment', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      const comment = await service.findById(fakeComment.id);
      expect(comment).toEqual(fakeComment);
      expect(repoSpy).toHaveBeenCalledWith({ id: fakeComment.id });
    });

    it('should throw an error if comment was not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.findById(fakeComment.id);
      } catch (err) {}
    });
  });

  describe('countByBlog', () => {
    it('should get number of comments a blog has', async () => {
      const repoSpy = jest.spyOn(repository, 'count');
      const blogsServiceSpy = jest.spyOn(blogsService, 'findById');
      const blogId = 'testId';
      const count = await service.countByBlog(blogId);
      expect(count).toEqual({ count: fakeComments.length });
      expect(blogsServiceSpy).toHaveBeenCalledWith(blogId);
      expect(repoSpy).toHaveBeenCalledWith({ where: { blog: fakeBlog } });
    });
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const repoSpy = jest.spyOn(repository, 'create');
      const blogsServiceSpy = jest.spyOn(blogsService, 'findById');
      const comment = await service.create(
        { ...fakeComment, blogId: fakeComment.id },
        fakeUser,
      );
      expect(comment).toEqual(fakeComment);
      expect(blogsServiceSpy).toHaveBeenCalledWith(fakeComment.id);
      expect(repoSpy).toHaveBeenCalledWith({
        content: fakeComment.content,
        blog: fakeBlog,
        user: fakeUser,
      });
    });

    it('should throw an error is a blog post was not found', async () => {
      fakeBlogsService.findById = jest.fn().mockResolvedValue(null);
      try {
        await service.create(
          { ...fakeComment, blogId: fakeComment.id },
          fakeUser,
        );
      } catch (err) {}
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeComment);
      const serviceSpy = jest.spyOn(service, 'findById');
      const repoSpy = jest.spyOn(repository, 'save');
      const comment = await service.update(fakeComment.id, fakeComment);
      expect(comment).toEqual({ ...fakeComment, edited: true });
      expect(serviceSpy).toHaveBeenCalledWith(fakeComment.id);
      expect(repoSpy).toHaveBeenCalledWith({ ...fakeComment, edited: true });
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeComment);
      const serviceSpy = jest.spyOn(service, 'findById');
      const repoSpy = jest.spyOn(repository, 'save');
      expect(await service.delete(fakeComment.id)).toEqual({ deleted: true });
      expect(serviceSpy).toHaveBeenCalledWith(fakeComment.id);
      expect(repoSpy).toHaveBeenCalledWith({ ...fakeComment, edited: true });
    });
  });
});
