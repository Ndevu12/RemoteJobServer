import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";


const userClient = new PrismaClient().user;
const companyClient = new PrismaClient().company;

interface AccountType {
    id?: string;
    name?: string;
    email?: string;
    website?: string;
    occupation?: string;
    logo?: string;
    logoBackground?: string;
    password?: string;
}

export class Account {
    getAccountInfo: RequestHandler = async (req, res) => {
        try {
            let accountUserId = req.userId;
            let accountCompanyId = req.companyId;

            let account;

            if (accountUserId) {
                account = await userClient.findUnique({
                    where: {
                        id: accountUserId
                    },
                    select: {
                        id: true,
                        name: true,
                        occupation: true,
                        email: true,
                        AppliedJobs: {
                            select: {
                                job: {
                                    select: {
                                        id: true,
                                        position: true,
                                        location: true,
                                        postedAt: true,
                                        contract: true,
                                        apply: true,
                                        description: true,
                                        requirements: true,
                                        role: true,
                                        AppliedJobs: true,
                                        company: {
                                            select: {
                                                name: true,
                                                logo: true,
                                                logoBackground: true,
                                                website: true
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                });
                
                account = {
                    ...account,
                    ['AppliedJobs']: account?.AppliedJobs.map((job: { job: any; }) => job.job)
                };
            }
            else if (accountCompanyId) {

                account = await companyClient.findUnique({
                    where: {
                        id: accountCompanyId
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        website: true,
                        logo: true,
                        logoBackground: true,
                        Jobs: {
                            select: {
                                id: true,
                                position: true,
                                location: true,
                                postedAt: true,
                                contract: true,
                                apply: true,
                                description: true,
                                requirements: true,
                                role: true,
                                company: {
                                    select: {
                                        name: true,
                                        logo: true,
                                        logoBackground: true,
                                        website: true
                                    }
                                },
                            }
                        },
                    }
                });
            }
            else {
                return res.status(401).json({ message: "You're not Authorized" });
            }

            res.status(200).json({ account: account });

        } catch (error) {
            if ((error as Error).name === 'PrismaClientKnownRequestError') {
                res.status(409)
                    .json({
                        message: 'User already exist'
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
}
