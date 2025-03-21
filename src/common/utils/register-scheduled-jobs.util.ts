import { Logger } from '@nestjs/common';
import { Queue, RepeatOptions } from 'bullmq';

interface IRegisterRepeatableJob {
    jobName: string;
    options: RepeatOptions;
}
// что то не то
export const registerScheduledJobs = async (queue: Queue, scheduledJobs: IRegisterRepeatableJob[]) => {
    const jobs = await queue.getJobSchedulers();

    const jobsForRemoving = jobs.filter(
        (job) => !scheduledJobs.find((repeatableJob) => repeatableJob.jobName === job.name),
    );

    for (const job of jobsForRemoving) {
        await queue.removeJobScheduler(job.name);
        Logger.verbose(`Job ${job.name} has been removed`, 'RegisterRepeatableJobs');
    }

    for (const job of scheduledJobs) {
        await queue.upsertJobScheduler(job.jobName, job.options);
        Logger.verbose(`Job ${job.jobName} has been updated`, 'RegisterRepeatableJobs');
    }
};
