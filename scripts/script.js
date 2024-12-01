$(document).ready(function() {
    // Function to update category counts
    function updateCategoryCounts() {
        // Select all categories including 'All'
        $('.sidebar .category').each(function() {
            var categoryData = $(this).attr('data-category');
            if(categoryData) { // Exclude "All" category
                // Count posts that include this category
                var count = $('.post-entry').filter(function() {
                    const categories = $(this).attr('data-category').split(',').map(cat => cat.trim());
                    return categories.includes(categoryData);
                }).length;
                $(this).find('.quarto-category-count').text('(' + count + ')');
            } else {
                // Update 'All' category count to total posts
                var total = $('.post-entry').length;
                $(this).find('.quarto-category-count').text('(' + total + ')');
            }
        });
    }

    // Initial update of category counts
    updateCategoryCounts();

    // Initialize Pagination
    var items = $("#post-list .post-entry");
    var numItems = items.length;
    var perPage = 3; // Number of posts per page

    // Initialize pagination plugin
    $('#listing-pagination .pagination').pagination({
        items: numItems,
        itemsOnPage: perPage,
        displayedPages: 3,
        edges: 1,
        prevText: '&laquo; Previous',
        nextText: 'Next &raquo;',
        onPageClick: function(pageNumber) {
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            items.hide().slice(showFrom, showTo).show();
            // Disable/Enable Previous and Next buttons
            if(pageNumber === 1){
                $('#listing-pagination .pagination .page-item:first').addClass('disabled');
            } else {
                $('#listing-pagination .pagination .page-item:first').removeClass('disabled');
            }
            if(showTo >= numItems){
                $('#listing-pagination .pagination .page-item:last').addClass('disabled');
            } else {
                $('#listing-pagination .pagination .page-item:last').removeClass('disabled');
            }
        }
    });

    // Initially show first page items
    items.hide().slice(0, perPage).show();

    // Category Filtering
    $('.category').click(function() {
        // Remove 'active' class from all categories
        $('.category').removeClass('active');
        // Add 'active' class to the clicked category
        $(this).addClass('active');

        const selectedCategory = $(this).attr('data-category');

        if(selectedCategory === "") {
            // Show all posts
            items.show();
            $('.listing-no-matching').hide();
        } else {
            // Filter posts that include the selected category in their data-category attribute
            const filteredPosts = items.filter(function() {
                const categories = $(this).attr('data-category').split(',').map(cat => cat.trim());
                return categories.includes(selectedCategory);
            });
            items.hide();
            filteredPosts.show();

            // Update "No matching items" message
            if(filteredPosts.length === 0) {
                $('.listing-no-matching').removeClass('d-none');
            } else {
                $('.listing-no-matching').addClass('d-none');
            }
        }

        // After filtering, update category counts
        updateCategoryCounts();

        // Reset pagination after filtering
        $('#listing-pagination .pagination').pagination('destroy'); // Destroy existing pagination

        var filteredItems = selectedCategory === "" ? items : items.filter(function() {
            const categories = $(this).attr('data-category').split(',').map(cat => cat.trim());
            return categories.includes(selectedCategory);
        });
        var filteredNumItems = filteredItems.length;

        // Initialize pagination based on filtered items
        $('#listing-pagination .pagination').pagination({
            items: filteredNumItems,
            itemsOnPage: perPage,
            displayedPages: 3,
            edges: 1,
            prevText: '&laquo; Previous',
            nextText: 'Next &raquo;',
            onPageClick: function(pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                filteredItems.hide().slice(showFrom, showTo).show();
                // Disable/Enable Previous and Next buttons
                if(pageNumber === 1){
                    $('#listing-pagination .pagination .page-item:first').addClass('disabled');
                } else {
                    $('#listing-pagination .pagination .page-item:first').removeClass('disabled');
                }
                if(showTo >= filteredNumItems){
                    $('#listing-pagination .pagination .page-item:last').addClass('disabled');
                } else {
                    $('#listing-pagination .pagination .page-item:last').removeClass('disabled');
                }
            }
        });

        // Show first page of filtered items
        filteredItems.hide().slice(0, perPage).show();
    });

    // Theme Toggle Functionality
    const toggleSwitch = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobiscroll Initialization (If Needed)
    if (typeof mobiscroll !== 'undefined') {
        var inst = mobiscroll.eventcalendar('#demo-mobile-month-view', {
            theme: 'ios',
            themeVariant: 'light',
            clickToCreate: false,
            dragToCreate: false,
            dragToMove: false,
            dragToResize: false,
            eventDelete: false,
            view: {
              calendar: { type: 'month' },
              agenda: { type: 'month' },
            },
            onEventClick: function (args) {
              mobiscroll.toast({
                message: args.event.title,
              });
            },
        });
        
        mobiscroll.getJson(
            'https://trial.mobiscroll.com/events/?vers=5',
            function (events) {
                inst.setEvents(events);
            },
            'jsonp',
        );
    }
});
