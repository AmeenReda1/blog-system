import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Blog } from '../entities/blog.entity';

export const BLOG_PAGINATION_CONFIG: PaginateConfig<Blog> = {
    sortableColumns: ['id', 'title', 'created_at'],
    defaultSortBy: [['created_at', 'DESC']],
    searchableColumns: ['title', 'content'],
    filterableColumns: { 
        'tags.name': [FilterOperator.IN], 
        title: [FilterOperator.EQ, FilterOperator.CONTAINS], 
        author_id: [FilterOperator.EQ]
    },
    maxLimit: 100,
    defaultLimit: 10,
};