export const GetAllBlogsResponse = {
    message: 'Blogs fetched successfully',
    data: [
        {
            id: 15,
            created_at: "2025-04-17T07:13:51.104Z",
            updated_at: "2025-04-17T07:13:51.104Z", 
            deleted_at: null,
            title: "technical topic",
            content: "his is a technical topic aboud rabbitmq we will discuss how we can implement it in our systsm",
            tags: [
                "programming",
                "computer science", 
                "node js"
            ],
            author_id: 3,
            author: {
                id: 3,
                created_at: "2025-04-16T20:09:16.972Z",
                updated_at: "2025-04-16T20:09:16.972Z",
                deleted_at: null,
                email: "ameenreda0@gmail.com",
                firstName: "ameen",
                lastName: "Reda",
                password: "$2b$10$axXzdCls8a2KCx3my8wsv.XmDYyawgvs28Bn7lnpJAPTYZmJMHYZa",
                userType: "editor",
                mobileNumber: "01124471441"
            }
        }
    ],
    meta: {
        itemsPerPage: 5,
        totalItems: 20,
        currentPage: 2,
        totalPages: 4,
        sortBy: [["created_at", "DESC"]],
        search: "tech",
        searchBy: ["title", "content"]
    },
    links: {
        first: "http://localhost:3000/blogs?page=1&limit=5&sortBy=created_at:DESC&search=tech",
        previous: "http://localhost:3000/blogs?page=1&limit=5&sortBy=created_at:DESC&search=tech", 
        current: "http://localhost:3000/blogs?page=2&limit=5&sortBy=created_at:DESC&search=tech",
        next: "http://localhost:3000/blogs?page=3&limit=5&sortBy=created_at:DESC&search=tech",
        last: "http://localhost:3000/blogs?page=4&limit=5&sortBy=created_at:DESC&search=tech"
    }
}