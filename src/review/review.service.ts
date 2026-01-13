import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  create(storeId: string, createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      storeId,
    });
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findByStoreId(storeId: string) {
    const review = await this.reviewRepository.find({
      where: { storeId },
      order: { updatedAt: 'DESC' },
    });
    if (!review) {
      throw new NotFoundException('Reviews not found for this store');
    }
    return review;
  }

  async findById(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findById(id);
    const new_review = Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(new_review);
  }

  async remove(id: string) {
    const review = await this.findById(id);
    return this.reviewRepository.remove(review);
  }
}
