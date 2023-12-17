import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Paginate({ pages, page, keyword = '', isAdmin = false, pagination_range, baseURL='', adminURL = 'productlist' }) {
  if (keyword) {
    keyword = keyword.split('?keyword=')[1].split('&')[0];
  }
  
  const paginationItems = [];

  if (pages > 1) {
    if (pagination_range && Array.isArray(pagination_range)) {
      if (page > 1) {
        paginationItems.push(
          <LinkContainer
            key={`page-prev`}
            to={{
              pathname: !isAdmin ? `/${baseURL}/` : (baseURL !== 'profile' ? `/admin/${adminURL}/` : `/${baseURL}/`),
              search: `?keyword=${keyword}&page=${page - 1}`,
            }}
          >
            <Pagination.Prev />
          </LinkContainer>
        );
      }

      for (let i = 0; i < pagination_range.length; i++) {
        const pageNumber = pagination_range[i];

        if (i === 0 && pageNumber !== 1) {
          paginationItems.push(
            <LinkContainer
              key={`page-1`}
              to={{
                pathname: baseURL !== 'profile' ? (!isAdmin ? `/${baseURL}/` : `/admin/${adminURL}/`) : `/${baseURL}/`,
                search: `?keyword=${keyword}&page=1`,
              }}
            >
              <Pagination.Item>{1}</Pagination.Item>
            </LinkContainer>
          );

          paginationItems.push(<Pagination.Ellipsis key={`ellipsis-start`} className="custom-ellipsis" />);
        }

        paginationItems.push(
          <LinkContainer
            key={`page-${pageNumber}`}
            to={{
              pathname: baseURL !== 'profile' ? (!isAdmin ? `/${baseURL}/` : `/admin/${adminURL}/`) : `/${baseURL}/`,
              search: `?keyword=${keyword}&page=${pageNumber}`,
            }}
          >
            <Pagination.Item className={(pageNumber === page || (page > pages && pageNumber === pages)) ? 'marked' : ''}>
              {pageNumber}
            </Pagination.Item>
          </LinkContainer>
        );

        if (i === pagination_range.length - 1 && pageNumber !== pages) {
          paginationItems.push(<Pagination.Ellipsis key={`ellipsis-end`} className="custom-ellipsis" />);

          paginationItems.push(
            <LinkContainer
              key={`page-${pages}`}
              to={{
                pathname: baseURL !== 'profile' ? (!isAdmin ? `/${baseURL}/` : `/admin/${adminURL}/`) : `/${baseURL}/`,
                search: `?keyword=${keyword}&page=${pages}`,
              }}
            >
              <Pagination.Item className={(page > pages && pageNumber === pages) ? 'marked' : ''}>
                {pages}
              </Pagination.Item>
            </LinkContainer>
          );
        }
      }

      if (page < pages) {
        paginationItems.push(
          <LinkContainer
            key={`page-next`}
            to={{
              pathname: baseURL !== 'profile' ? (!isAdmin ? `/${baseURL}/` : `/admin/${adminURL}/`) : `/${baseURL}/`,
              search: `?keyword=${keyword}&page=${page + 1}`,
            }}
          >
            <Pagination.Next />
          </LinkContainer>
        );
      }
    }

    return (
      <Pagination className='pagination-margins'>
        {paginationItems}
      </Pagination>
    );
  }

  return null;
}

export default Paginate