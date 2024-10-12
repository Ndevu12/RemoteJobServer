import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const jobClient = new PrismaClient().job;
const appliedJobsClient = new PrismaClient().appliedJobs;

interface JobType {
    id?: string;
    position?: string;
    postedAt?: string;
    contract?: string;
    location?: string;
    apply?: string;
    description?: string;
    companyId?: string;
}

export class Job {
    //GET ALL JOBS
    getJobs: RequestHandler = async (req, res) => {
        try {
            console.log('Inside Job controller');
            const jobs = await jobClient.findMany(
                {
                    include: {
                        company: {
                            select: {
                                name: true,
                                logo: true,
                                logoBackground: true,
                                website: true
                            }
                        },
                        AppliedJobs: true
                    }
                }
            );

            if (!(jobs.length > 0)) return res.status(404).json({message: 'Job not found'})

            res.status(200).json({ jobs: jobs })
        } catch (error) {
            console.log('Inside Job controller error: ', error)
            res.status(500)
                .json({
                    status: 'Server Error.',
                    error: error
                })
        }
    }

    //GET SINGLE JOB BY ID
    getJob: RequestHandler = async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await jobClient.findUnique({
                where: {
                    id: jobId
                },
                include: {
                    company: {
                        select: {
                            name: true,
                            logo: true,
                            logoBackground: true,
                            website: true
                        }
                    },
                    AppliedJobs: true
                }
            })

            if (!job) {
                return res.status(404).json({ message: "Job not found." });
            }

            res.status(200).json({ job })
        } catch (error) {
            res.status(500)
                .json({
                    status: 'Server Error.',
                    error: error
                })
        }
    }


    //CREATING JOB
    postJob: RequestHandler = async (req, res) => {

        try {
            const jobData = req.body;

            jobData['companyId'] = req.companyId;

            if (jobData.id) {
                delete jobData.id;
            }

            const job = await jobClient.create({
                data: jobData
            })

            res.status(201).json({ job })
        } catch (error) {

            res.status(500)
                .json({
                    status: 'Server Error.',
                    error: error
                })
        }
    }

    //UPDATING A JOB
    putJob: RequestHandler = async (req, res) => {
        try {
            const jobId = req.params.id
            const jobData: JobType = req.body;

            if (jobData.id) {
                delete jobData.id;
            }

            const job = await jobClient.update({
                where: {
                    id: jobId
                },
                data: jobData
            })
            if (!job) {
                res.status(404)
                    .json({
                        message: 'Job not Found'
                    })
            }
            res.status(200).json({ job })
        } catch (error) {
            if ((error as Error).name === 'PrismaClientKnownRequestError') {
                res.status(404)
                    .json({
                        message: 'Job not Found'
                    })
            }
            else if ((error as Error).name === 'PrismaClientValidationError') {
                res.status(422)
                    .json({
                        message: 'Validation Error'
                    })
            } else {
                res.status(500)
                    .json({
                        status: 'Server Error.',
                        error: error
                    })
            }
        }
    }

    //DELETING A JOB
    deleteJob: RequestHandler = async (req, res) => {
        try {
            const jobId = req.params.id

            const job = await jobClient.delete({
                where: {
                    id: jobId
                }
            })

            res.status(200).json({ status: 'Job was successfully deleted' })
        } catch (error) {
            if ((error as Error).name === 'PrismaClientKnownRequestError') {
                res.status(404)
                    .json({
                        status: 'Job not Found'
                    })
            } else {
                res.status(500)
                    .json({
                        status: 'Server Error.',
                        error: error
                    })
            }

        }
    }
    //GET SINGLE JOB BY ID
    postApplyJob: RequestHandler = async (req, res) => {
        try {
            const userId = req.userId;
            const jobId = req.params.id;

            if (!userId || !jobId) {
                return res.status(400).json({ message: "Provide all required inputs" })
            }
            const applyJob = await appliedJobsClient.create({
                data: {
                    userId: userId,
                    jobId: jobId
                }
            })
            res.status(201).json({ applyJob })
        } catch (error) {
            if ((error as Error).name === 'PrismaClientKnownRequestError') {
                return res.status(404).json({message: 'Make sure the job exist.'});
            }
            else {
                return res.status(500)
                .json({
                    status: 'Server Error.',
                    error: error
                })
            }
        }
    }
}