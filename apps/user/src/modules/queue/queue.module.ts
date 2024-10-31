import { IMAGE_GENERATOR_QUEUE_PROCESSOR } from '@commons/constants/queue/image-generator-queue.constant';
import { DiceBearModule } from '@diceb/dicebear';
import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ImageGeneratorQueueProcessor } from './processors/image-generator-queue.processor';
import { ImageGeneratorQueueService } from './services/image-generator-queue.service';

@Global()
@Module({
  imports: [
    DiceBearModule.forRoot({}),
    BullModule.registerQueue({
      name: IMAGE_GENERATOR_QUEUE_PROCESSOR,
    }),
  ],
  providers: [ImageGeneratorQueueProcessor, ImageGeneratorQueueService],
  exports: [ImageGeneratorQueueService],
})
export class QueueModule {}
