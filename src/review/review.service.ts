import { Injectable } from '@nestjs/common';
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

  findByStoreId(storeId: string) {
    return this.reviewRepository.find({
      where: { storeId },
      order: { updatedAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
