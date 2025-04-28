import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    console.log('12312312', createPostDto);
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(id: number): Promise<Post> {
    const post: Post | null = await this.postRepository.findOne({
      where: { 
        id,
        user: {
          username: Equal('test1')
        }
       },
      relations: ['user'],
      select: {
        
        user: {
          username: true
        },
      }
    });
    if (!post) {
      throw new NotFoundException(`post with ID ${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
