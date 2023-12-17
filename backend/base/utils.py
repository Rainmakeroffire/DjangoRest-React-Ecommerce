from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def paginate(request, obj, per_page, page_items_displayed, serializer, item_name):

    page = request.query_params.get('page')
    paginator = Paginator(obj, per_page)

    try:
        obj = paginator.page(page)
    except PageNotAnInteger:
        obj = paginator.page(1)
    except EmptyPage:
        obj = paginator.page(paginator.num_pages)

    if page is None:
        page = 1

    page = int(page)

    serializer = serializer(obj, many=True)

    total_pages = paginator.num_pages

    if total_pages <= page_items_displayed:
        pagination_range = range(1, total_pages + 1)
    else:
        if page <= page_items_displayed // 2 + 1:
            pagination_range = range(1, page_items_displayed + 1)
        elif page >= total_pages - 2:
            pagination_range = range(total_pages - (page_items_displayed - 1), total_pages + 1)
        else:
            pagination_range = range(page - page_items_displayed // 2, page + page_items_displayed // 2 + 1)

    return {
        item_name: serializer.data,
        'page': page,
        'pages': total_pages,
        'pagination_range': list(pagination_range)
    }
