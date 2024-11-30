$(document).ready(function() {
    // Function to update category counts
    function updateCategoryCounts() {
        // Select all categories including 'All'
        $('.quarto-listing-category .category').each(function() {
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
    var items = $("#listing-listing .post-entry");
    var numItems = items.length;
    var perPage = 5; // Number of posts per page

    // Hide all items beyond the first page
    items.slice(perPage).hide();

    // Initialize pagination
    $('#listing-pagination .pagination').pagination({
        items: numItems,
        itemsOnPage: perPage,
        cssStyle: 'light-theme',
        prevText: '&laquo; Previous',
        nextText: 'Next &raquo;',
        onPageClick: function(pageNumber) {
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            items.hide().slice(showFrom, showTo).show();
        }
    });

    // Category Filtering
    const categories = $('.quarto-listing-category .category');
    const posts = $('.post-entry');
    const noMatching = $('.listing-no-matching');

    categories.click(function() {
        // Remove 'active' class from all categories
        categories.removeClass('active');
        // Add 'active' class to the clicked category
        $(this).addClass('active');

        const selectedCategory = $(this).attr('data-category');

        if(selectedCategory === "") {
            // Show all posts
            posts.show();
            noMatching.hide();
        } else {
            // Filter posts that include the selected category in their data-category attribute
            const filteredPosts = posts.filter(function() {
                const categories = $(this).attr('data-category').split(',').map(cat => cat.trim());
                return categories.includes(selectedCategory);
            });
            posts.hide();
            filteredPosts.show();

            // Update "No matching items" message
            if(filteredPosts.length === 0) {
                noMatching.show();
            } else {
                noMatching.hide();
            }
        }

        // After filtering, update category counts
        updateCategoryCounts();

        // Reset pagination after filtering
        $('#listing-pagination .pagination').pagination('destroy'); // Destroy existing pagination
        var filteredItems = selectedCategory === "" ? posts : posts.filter(function() {
            const categories = $(this).attr('data-category').split(',').map(cat => cat.trim());
            return categories.includes(selectedCategory);
        });
        var filteredNumItems = filteredItems.length;

        // Hide all filtered items beyond the first page
        filteredItems.slice(perPage).hide();

        // Re-initialize pagination based on filtered items
        $('#listing-pagination .pagination').pagination({
            items: filteredNumItems,
            itemsOnPage: perPage,
            cssStyle: 'light-theme',
            prevText: '&laquo; Previous',
            nextText: 'Next &raquo;',
            onPageClick: function(pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                filteredItems.hide().slice(showFrom, showTo).show();
            }
        });
    });
});



    document.addEventListener('DOMContentLoaded', function () {
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
    });


    document.addEventListener('DOMContentLoaded', function () {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    });


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
        