import {
  IMAGE_GENERATOR_QUEUE_PROCESS,
  IMAGE_GENERATOR_QUEUE_PROCESSOR,
} from '@commons/constants/queue/image-generator-queue.constant';
import {
  DiceBearService,
  IDiceBear,
  IDiceBearGenerateParams,
} from '@diceb/dicebear';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(IMAGE_GENERATOR_QUEUE_PROCESSOR)
export class ImageGeneratorQueueProcessor {
  constructor(private readonly diceBearService: DiceBearService) {}

  private readonly logger = new Logger(ImageGeneratorQueueProcessor.name);

  @Process(IMAGE_GENERATOR_QUEUE_PROCESS)
  async process(job: Job<IDiceBearGenerateParams>): Promise<IDiceBear> {
    const data = job.data;
    const result = await this.diceBearService.generateAvatar(data);
    return result;
  }

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.verbose(`Processing job ${job.id} of type ${job.name}.`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: IDiceBear): IDiceBear {
    this.logger.verbose(`Completed job ${job.id} of type ${job.name}.`);
    this.logger.verbose(`Result: ${JSON.stringify(result)}`);
    return result;
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(`Failed job ${job.id} of type ${job.name}.`);
    this.logger.error(`Failed: ${error.message}`);
  }

  @OnQueueError()
  onError(job: Job, error: Error): void {
    this.logger.error(`Error processing job ${job.id} of type ${job.name}.`);
    this.logger.error(`Error: ${error.message}`);
  }
}
