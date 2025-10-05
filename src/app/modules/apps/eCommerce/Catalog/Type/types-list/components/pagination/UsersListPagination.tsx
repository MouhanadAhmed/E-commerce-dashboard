import clsx from 'clsx';
import {
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '../../../types-list/core/QueryResponseProvider';
import { useQueryRequest } from '../../../types-list/core/QueryRequestProvider';
import { useMemo } from 'react';
import { PaginationState } from '../../../../../../../../../_metronic/helpers';

const mappedLabel = (label: string): string => {
  if (label === '&laquo; Previous') {
    return 'Previous';
  }

  if (label === 'Next &raquo;') {
    return 'Next';
  }

  return label;
};

const UsersListPagination = () => {
  const pagination = useQueryResponsePagination();
  const isLoading = useQueryResponseLoading();
  const { updateState } = useQueryRequest();
  const pageNum = Number(pagination.page);
  const updatePage = (page: string | number | undefined | null) => {
    const pageStr = page ? page.toString() : '1';
    if (!page || isLoading || pagination.page == pageStr) {
      return;
    }

    const pageCount = pagination.PageCount || 1000;
    updateState({
      page: pageStr,
      PageCount: pageCount,
      limit: pageCount,
    });
  };

  const PAGINATION_PAGES_COUNT = 5;
  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return [];
    }

    const scopedLinks = [...pagination.links];

    let pageLinks: Array<{
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    }> = [];
    const previousLink: {
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    } = scopedLinks.shift()!;
    const nextLink: {
      label: string;
      active: boolean;
      url: string | null;
      page: number | null;
    } = scopedLinks.pop()!;

    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2);

    pageLinks.push(previousLink);

    if (
      pagination.page &&
      Number(pagination.page) <= Math.round(PAGINATION_PAGES_COUNT / 2)
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT),
      ];
    }

    if (
      pageNum > scopedLinks.length - halfOfPagesCount &&
      scopedLinks.length > PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          scopedLinks.length - PAGINATION_PAGES_COUNT,
          scopedLinks.length
        ),
      ];
    }

    if (
      !(
        pageNum <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
        scopedLinks.length <= PAGINATION_PAGES_COUNT
      ) &&
      !(pageNum > scopedLinks.length - halfOfPagesCount)
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          pageNum - 1 - halfOfPagesCount,
          pageNum + halfOfPagesCount
        ),
      ];
    }

    pageLinks.push(nextLink);

    return pageLinks;
  };

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination]);

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"></div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_users_paginate">
          <ul className="pagination">
            <li
              className={clsx('page-item', {
                disabled: isLoading || pageNum == 1,
              })}
            >
              <a
                onClick={() => updatePage(1)}
                style={{ cursor: 'pointer' }}
                className="page-link"
              >
                First
              </a>
            </li>
            {paginationLinks
              ?.map((link) => {
                return { ...link, label: mappedLabel(link.label) };
              })
              .map((link) => (
                <li
                  key={link.label}
                  className={clsx('page-item', {
                    active: pageNum === link.page,
                    disabled: isLoading,
                    previous: link.label === 'Previous',
                    next: link.label === 'Next',
                  })}
                >
                  <a
                    className={clsx('page-link', {
                      'page-text':
                        link.label === 'Previous' || link.label === 'Next',
                      'me-5': link.label === 'Previous',
                    })}
                    onClick={() => updatePage(link.page)}
                    style={{ cursor: 'pointer' }}
                  >
                    {mappedLabel(link.label)}
                  </a>
                </li>
              ))}
            <li
              className={clsx('page-item', {
                disabled:
                  isLoading || pageNum === (pagination.links?.length || 3) - 2,
              })}
            >
              <a
                onClick={() => updatePage((pagination.links?.length || 3) - 2)}
                style={{ cursor: 'pointer' }}
                className="page-link"
              >
                Last
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { UsersListPagination };
