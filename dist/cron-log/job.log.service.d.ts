export declare enum Direction {
    ASC = "ASC",
    DESC = "DESC"
}
export declare const PAGE_LIMIT = 20;
export interface Pagination {
    pageNumber: number;
    sortBy: string;
    direction: Direction;
}
export interface JobDetail extends Pagination {
    id: BigInt;
}
export interface JobLogService {
    getJobs: (pagination: Pagination) => Promise<any>;
    getJobLogs: (cronDetail: JobDetail) => Promise<any>;
}
//# sourceMappingURL=job.log.service.d.ts.map