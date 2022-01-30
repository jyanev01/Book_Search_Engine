import gql from '@apollo/client';

export const GET_ALL = gql`
    {
        all {
            _id
            username
            email
            savedBooks {
                title
                bookId
                authors
                description
                image
                link
            }
        }
    }
`;