import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { User, UserType } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Blog } from './entities/blog.entity';
import { PaginateQuery } from 'nestjs-paginate';
import { UpdateBlogDto } from './dto/update-blog.dto';

// Mock implementation for BlogService
// We create a mock object that has the same methods as BlogService
// but we can control what these methods do and check if they were called.
const mockBlogService = {
  create: jest.fn(), // jest.fn() creates a mock function
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Start describing the test suite for BlogController
describe('BlogController', () => {
  let controller: BlogController; // Variable to hold the instance of our controller
  let service: BlogService; // Variable to hold the instance of our (mock) service

  // This block runs before each test case in this suite
  beforeEach(async () => {
    // Create a testing module similar to your main AppModule
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController], // Declare the controller we want to test
      providers: [
        {
          provide: BlogService, // Specify that we are providing BlogService
          useValue: mockBlogService, // But use our mock implementation instead of the real one
        },
      ],
    })
      // Override guards to avoid dealing with authentication/authorization in this unit test
      // We assume guards work correctly and test them separately
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock guard always allows access
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Mock guard always allows access
      .compile(); // Compile the module

    // Get the instances of the controller and service from the testing module
    controller = module.get<BlogController>(BlogController);
    service = module.get<BlogService>(BlogService);
  });

  // A sanity check test: ensures the controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Describe the specific method we are testing: create
  describe('create', () => {
    // Define the test case for the create method
    it('should create a new blog post and return it', async () => {
      // 1. Arrange: Set up the necessary mock data and expectations

      // Mock input data for the controller method
      const createBlogDto: CreateBlogDto = {
        title: 'Test Blog Title',
        content: 'Test Blog Content',
      };

      // Mock user data (assuming GetUser decorator provides this)
      // Use Partial<User> because we are only defining the data properties, not methods
      const mockUser: Partial<User> = {
        id: 1, // Assuming AbstractEntity provides id
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password', // In real scenarios, this would be hashed
        userType: UserType.EDITOR, // Use EDITOR as it's the default
        mobileNumber: '1234567890',
        blogs: [],
        created_at: new Date(), // Assuming from AbstractEntity
        updated_at: new Date(), // Assuming from AbstractEntity
        deleted_at: null,      // Assuming from AbstractEntity
      };

      // Mock blog data that the service is expected to return
      // Ensure Blog entity structure matches
      // Use Partial<Blog> for consistency
      const expectedBlog: Partial<Blog> = {
        id: 1,
        author_id: mockUser.id,
        title: createBlogDto.title,
        content: createBlogDto.content,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        author: mockUser as User, // Need to cast back for the Blog entity relation
      };

      // Tell our mock service's create function what to return when called
      // We expect the service to return a full Blog object, so cast the partial mock
      mockBlogService.create.mockResolvedValue(expectedBlog as Blog);

      // 2. Act: Call the controller method we are testing
      // Pass the partial mock user, casting it to User for the method signature
      const result = await controller.create(createBlogDto, mockUser as User);

      // 3. Assert: Check if the results are as expected

      // Check if the service's create method was called exactly once
      expect(service.create).toHaveBeenCalledTimes(1);

      // Check if the service's create method was called with the correct arguments
      // Cast mockUser to User for the assertion
      expect(service.create).toHaveBeenCalledWith(createBlogDto, mockUser as User);

      // Check if the controller returned the expected structure and data
      // Compare against the partial mock blog data
      expect(result).toEqual({
        message: 'Blog created successfully',
        data: expectedBlog,
      });
    });
    it('should find all blog posts', async () => {
      // Mock input data for the controller method
      const query: PaginateQuery = {
        page: 1,
        limit: 10,
        sortBy: [['created_at', 'desc']],
        path: '/blogs', // Provide a valid path as required by PaginateQuery
      };

      // Mock blog data that the service is expected to return
      const expectedBlogs: Partial<Blog>[] = [
        {
          id: 1,
          title: 'Test Blog Title 1',
          content: 'Test Blog Content 1',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          id: 2,
          title: 'Test Blog Title 2',
          content: 'Test Blog Content 2',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      // Tell our mock service's findAll function what to return when called
      mockBlogService.findAll.mockResolvedValue(expectedBlogs as Blog[]);

      // Call the controller method we are testing
      const result = await controller.findAll(query);

      // Check if the service's findAll method was called exactly once
      expect(service.findAll).toHaveBeenCalledTimes(1);

      // Check if the service's findAll method was called with the correct arguments
      expect(service.findAll).toHaveBeenCalledWith(query);

      // Check if the controller returned the expected structure and data
      expect(result).toEqual(expectedBlogs);
    });
  });
  it('should find a blog psot by id', async () => {
    const blogId = 1;

    const expectedBlog: Partial<Blog> = {
      id: blogId,
      title: 'Test Blog Title',
      content: 'Test Blog Content',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    mockBlogService.findOne.mockResolvedValue(expectedBlog as Blog);

    const result = await controller.findOne(blogId);

    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toHaveBeenCalledWith(blogId);
    expect(result).toEqual({
      message: 'Blog fetched successfully',
      data: expectedBlog,
    });
  });
  it('should update a blog post', async ()=>{

    const blogId = 1;
    const updateBlogDto: UpdateBlogDto = {
      title: 'Updated Blog Title',
      content: 'Updated Blog Content',
    }
    const mockUser:Partial<User> = {
      id: 1,
      email: 'ameen@gmail.com',
      userType: UserType.EDITOR,
    }
    const expectedBlog: Partial<Blog> = {
      id: blogId,
      title: updateBlogDto.title,
      content: updateBlogDto.content,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }
    mockBlogService.update.mockResolvedValue(expectedBlog as Blog);
    const result= await controller.update(blogId, updateBlogDto, mockUser as User);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(blogId, updateBlogDto, mockUser as User);
    expect(result).toEqual({
      message: 'Blog updated successfully',
      data: expectedBlog,
    });
  })
  it('should delete a blog post', async () => {
    const blogId = 1;

    // Mock response from the service
    const mockResponse = {
      message: 'Blog deleted successfully',
    };

    // Tell our mock service's remove function what to return when called
    mockBlogService.remove.mockResolvedValue(mockResponse);

    // Call the controller method we are testing
    const result = await controller.remove(blogId);

    // Check if the service's remove method was called exactly once
    expect(service.remove).toHaveBeenCalledTimes(1);

    // Check if the service's remove method was called with the correct arguments
    expect(service.remove).toHaveBeenCalledWith(blogId);

    // Check if the controller returned the expected structure and data
    expect(result).toEqual({
      message: mockResponse.message,
      data: null,
    });
  });
});
