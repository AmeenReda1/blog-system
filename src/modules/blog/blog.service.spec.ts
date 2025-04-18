import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { User, UserType } from '../user/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogRepository } from './repositories/blog.repository';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; // Import Repository for type usage
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { TagRepository } from './repositories/tag.repository';
import { Tag } from './entities/tag.entity';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';



const mockBlogRepository = {
  saveOne: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  blogRepository: {} as Repository<Blog> 
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

const mockPaginate = jest.fn();

const mockUserService = {
};

const mockAuthService = {
};
const mockTagRepository = {
  findByIds: jest.fn(),
}

describe('BlogService', () => {
  let service: BlogService;
  let repository: BlogRepository;
  let cacheManager: RedisService;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockPaginate.mockClear(); // Also clear the standalone mock function

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: BlogRepository,
          useValue: mockBlogRepository,
        },
        {
          provide: RedisService,
          useValue: mockCacheManager,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: TagRepository,
          useValue: mockTagRepository,
        }
        // Provide the mock paginate function if it were injected, but here we call it directly
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    repository = module.get<BlogRepository>(BlogRepository);
    cacheManager = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- CREATE BLOG ---  
  describe('create Blog', () => {
    const createBlogDto: CreateBlogDto = {
      title: 'Test Blog Title',
      content: 'This is some test content for the blog.',
      tags: [1, 2, 3], // Assuming tags are passed as an array of IDs
    };

    const mockUser: Partial<User> = { id: 1, userType: UserType.EDITOR };

    it('should create a blog successfully with tags', async () => {
      // Arrange
      const blogToSave = new Blog();
      Object.assign(blogToSave, createBlogDto);
      blogToSave.author_id = mockUser.id!;

      const savedBlog = {
        ...blogToSave,
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as Blog;

      const mockTags = (createBlogDto.tags || []).map(id => ({ id, name: `Tag${id}` } as Tag));
      mockTagRepository.findByIds.mockResolvedValue(mockTags);
      mockBlogRepository.saveOne.mockResolvedValue(savedBlog);

      // Act
      const result = await service.create(createBlogDto, mockUser as User);

      // Assert
      expect(mockTagRepository.findByIds).toHaveBeenCalledWith(createBlogDto.tags);
      expect(mockBlogRepository.saveOne).toHaveBeenCalledWith(expect.any(Blog));
      expect(result).toEqual(savedBlog);
    });
  });

  // --- FIND ONE BLOG ---  
  describe('findOne', () => {
    const blogId = 1;
    const cacheKey = `blog_${blogId}`;
    const dummyBlog: Blog = {
      id: blogId,
      title: 'Dummy Blog Title',
      content: 'Dummy content',
      author_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      author: null, // Add relation properties if needed/present
      // tags: ['test'], // Assuming Blog entity doesn't have tags based on service code
    } as unknown as Blog; // Use 'as Blog' to satisfy type requirements

    it('should return blog from cache if exists', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(dummyBlog);

      // Act
      const result = await service.findOne(blogId);

      // Assert
      expect(result).toEqual(dummyBlog);
      expect(mockCacheManager.get).toHaveBeenCalledTimes(1);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockBlogRepository.findOne).not.toHaveBeenCalled();
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('should return blog from repository and set cache if not in cache', async () => {
      // Arrange
      mockCacheManager.get.mockResolvedValue(undefined); // Simulate cache miss
      mockBlogRepository.findOne.mockResolvedValue(dummyBlog); // Simulate DB find
      mockCacheManager.set.mockResolvedValue(undefined); // Mock cache set

      // Act
      const result = await service.findOne(blogId);

      // Assert
      expect(result).toEqual(dummyBlog);
      expect(mockCacheManager.get).toHaveBeenCalledTimes(1);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockBlogRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.findOne).toHaveBeenCalledWith({ where: { id: blogId } });
      expect(mockCacheManager.set).toHaveBeenCalledTimes(1);
      expect(mockCacheManager.set).toHaveBeenCalledWith(cacheKey, dummyBlog);
    });

    it('should throw NotFoundException if blog is not found in cache or repository', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);
      mockBlogRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(blogId)).rejects.toThrow(NotFoundException);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockBlogRepository.findOne).toHaveBeenCalledWith({ where: { id: blogId } });
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('should handle cache GET error and fetch from repository', async () => {
      // Arrange
      const cacheError = new Error('Redis connection failed');
      mockCacheManager.get.mockRejectedValue(cacheError);
      mockBlogRepository.findOne.mockResolvedValue(dummyBlog);
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.findOne(blogId);

      // Assert
      expect(result).toEqual(dummyBlog);
      expect(mockBlogRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBlogRepository.findOne).toHaveBeenCalledWith({ where: { id: blogId } });
      expect(mockCacheManager.set).toHaveBeenCalledTimes(1);
    });

    it('should handle cache SET error after fetching from repository', async () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const cacheError = new Error('Redis write failed');
      mockCacheManager.get.mockResolvedValue(undefined);
      mockBlogRepository.findOne.mockResolvedValue(dummyBlog);
      mockCacheManager.set.mockRejectedValue(cacheError); // Simulate cache set error

      // Act
      const result = await service.findOne(blogId);

      // Assert
      expect(result).toEqual(dummyBlog);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockBlogRepository.findOne).toHaveBeenCalledWith({ where: { id: blogId } });
      expect(consoleErrorSpy).toHaveBeenCalledWith(`Redis SET error for key ${cacheKey}:`, cacheError);
      consoleErrorSpy.mockRestore();
    });
  });


  describe('update', () => {
    const blogId = 1;
    const updateDto = { title: 'Updated Title' };
    const mockUser: Partial<User> = { id: 1 };
    const existingBlog: Blog = { id: blogId, title: 'Old Title', content: 'Old Content', author_id: mockUser.id } as Blog;
    const updatedBlog = { ...existingBlog, ...updateDto, updated_at: new Date() } as Blog;

    it('should update the blog and invalidate cache', async () => {
      mockBlogRepository.findOne.mockResolvedValue(existingBlog);
      mockBlogRepository.saveOne.mockResolvedValue(updatedBlog);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.update(blogId, updateDto, mockUser as User);

      expect(mockBlogRepository.findOne).toHaveBeenCalledWith({ where: { id: blogId } });
      expect(mockBlogRepository.saveOne).toHaveBeenCalledWith(expect.objectContaining({ id: blogId, title: updateDto.title }));
      expect(mockCacheManager.del).toHaveBeenCalledWith(`blog_${blogId}`);
      expect(result).toEqual(updatedBlog);
    });

    it('should throw NotFoundException if blog to update is not found', async () => {
      mockBlogRepository.findOne.mockResolvedValue(null);

      await expect(service.update(blogId, updateDto, mockUser as User)).rejects.toThrow(NotFoundException);
      expect(mockBlogRepository.saveOne).not.toHaveBeenCalled();
      expect(mockCacheManager.del).not.toHaveBeenCalled();
    });
  });

  // --- REMOVE BLOG --- (Example Test)
  describe('remove', () => {
    const blogId = 1;
    const cacheKey = `blog_${blogId}`;

    it('should soft delete the blog and invalidate cache', async () => {
      // Mock softDelete to indicate 1 row affected
      mockBlogRepository.softDelete.mockResolvedValue({ affected: 1, raw: {} });
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.remove(blogId);

      expect(mockBlogRepository.softDelete).toHaveBeenCalledWith(blogId);
      expect(mockCacheManager.del).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual({ message: 'Blog deleted successfully' });
    });

    it('should return message if blog was already deleted or not found', async () => {
      // Mock softDelete to indicate 0 rows affected
      mockBlogRepository.softDelete.mockResolvedValue({ affected: 0, raw: {}, });
      mockCacheManager.del.mockResolvedValue(undefined); // Cache should still be deleted

      const result = await service.remove(blogId);

      expect(mockBlogRepository.softDelete).toHaveBeenCalledWith(blogId);
      expect(mockCacheManager.del).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual({ message: 'Blog was already deleted or not found' });
    });


  });

});
