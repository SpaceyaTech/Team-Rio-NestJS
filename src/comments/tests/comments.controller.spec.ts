import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';
import { Comment } from '../comment.entity';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { User } from '../../users/user.entity';

const fakeUser: User = new User();

const fakeComment: Comment = new Comment('testId', 'test');

const fakeComments: Comment[] = [fakeComment];

const fakeService = {
  find: jest.fn().mockResolvedValue(fakeComments),
  findById: jest
    .fn()
    .mockImplementation((id: string) => Promise.resolve(fakeComment)),
  countByBlog: jest
    .fn()
    .mockImplementation((blogId: string) => Promise.resolve({ count: 1 })),
  create: jest
    .fn()
    .mockImplementation((comment: CreateCommentDto) =>
      Promise.resolve(fakeComment),
    ),
  update: jest
    .fn()
    .mockImplementation((id: string, attrs: Partial<Comment>) =>
      Promise.resolve(fakeComment),
    ),
  delete: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      deleted: true,
    }),
  ),
};

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CommentsService, useValue: fakeService }],
      controllers: [CommentsController],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a service', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should fetch all the comments', async () => {
      const serviceSpy = jest.spyOn(service, 'find');
      const comments = await controller.getComments();
      expect(comments).toEqual(fakeComments);
      expect(serviceSpy).toBeCalledWith();
    });
  });

  describe('findById', () => {
    it('should fetch a single comment', async () => {
      const serviceSpy = jest.spyOn(service, 'findById');
      const comment = await controller.getComment(fakeComment.id);
      expect(comment).toEqual(fakeComment);
      expect(serviceSpy).toBeCalledWith(fakeComment.id);
    });
  });

  describe('countByBlog', () => {
    it('should return the number of comments a blog has', async () => {
      const serviceSpy = jest.spyOn(service, 'countByBlog');
      const count = await controller.getBlogCommentsCount(fakeComment.id);
      expect(count).toEqual({ count: 1 });
      expect(serviceSpy).toBeCalledWith(fakeComment.id);
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      const comment = await controller.postComment(
        { ...fakeComment, blogId: 'testId' },
        fakeUser,
      );
      expect(comment).toEqual(fakeComment);
      expect(serviceSpy).toBeCalledWith(
        { ...fakeComment, blogId: 'testId' },
        fakeUser,
      );
    });
  });

  describe('update', () => {
    it('should edit a comment', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      const comment = await controller.editComment(fakeComment.id, fakeComment);
      expect(comment).toEqual(fakeComment);
      expect(serviceSpy).toBeCalledWith(fakeComment.id, fakeComment);
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      const serviceSpy = jest.spyOn(service, 'delete');
      expect(await controller.deleteComment(fakeComment.id)).toEqual({
        deleted: true,
      });
      expect(serviceSpy).toBeCalledWith(fakeComment.id);
    });
  });
});
