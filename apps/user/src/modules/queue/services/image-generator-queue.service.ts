import {
  IMAGE_GENERATOR_QUEUE_PROCESS,
  IMAGE_GENERATOR_QUEUE_PROCESSOR,
} from '@commons/constants/queue/image-generator-queue.constant';
import { IDiceBear, IDiceBearGenerateParams } from '@diceb/dicebear';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ImageGeneratorQueueService {
  constructor(
    @InjectQueue(IMAGE_GENERATOR_QUEUE_PROCESSOR)
    private readonly imageGenearatorQueue: Queue<IDiceBearGenerateParams>,
  ) {}

  async generateAvatar(data: IDiceBearGenerateParams): Promise<IDiceBear> {
    const job = await this.imageGenearatorQueue.add(
      IMAGE_GENERATOR_QUEUE_PROCESS,
      data,
    );

    return (await job.finished()) as IDiceBear;
  }
}
