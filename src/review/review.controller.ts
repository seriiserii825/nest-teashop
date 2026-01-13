import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { reviewResponse, reviewsResponse } from './response/review.response';

@Auth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('store/:storeId')
  @ApiBody({ type: CreateReviewDto })
  @ApiOkResponse(reviewResponse)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Param('storeId') storeId: string,
  ) {
    return this.reviewService.create(storeId, createReviewDto);
  }

  @Get()
  @ApiOkResponse(reviewsResponse)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('store/:storeId')
  @ApiNotFoundResponse({ description: 'Reviews not found for this store' })
  @ApiOkResponse(reviewsResponse)
  findByStoreId(@Param('storeId') storeId: string) {
    return this.reviewService.findByStoreId(storeId);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiOkResponse(reviewResponse)
  findById(@Param('id') id: string) {
    return this.reviewService.findById(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateReviewDto })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiOkResponse(reviewResponse)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiOkResponse(reviewResponse)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
