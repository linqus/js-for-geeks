(function(window, $) {
    'use strict';

    window.RepLogApp = function($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper);

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click', 
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
            this.handleNewFormSubmit.bind(this)
        )

    };

    $.extend(window.RepLogApp.prototype, {
        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(this.helper.calculateTotalWeight());
        },

        handleRepLogDelete: function (e) {
            e.preventDefault();
            var $link = $(e.currentTarget);
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');

            var self = this;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function() {
                    $row.fadeOut('normal', function() {
                        $row.remove();
                        self.updateTotalWeightLifted();
                    });
                }
            });
        },

        handleRowClick: function() {
            console.log('row clicked!');
        },

        handleNewFormSubmit: function(e) {

            e.preventDefault();
            var $form = $(e.currentTarget);
            var $tbody = this.$wrapper.find('tbody');
            var self = this;
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize(),
                success: function(dataresp) {
                    $tbody.append(dataresp);
                    self.updateTotalWeightLifted();
                },
                error: function(jqXHR) {
                    self.$wrapper.find('.js-form-wrapper').html(jqXHR.responseText);
                }
            })
        }
    });

    var Helper = function($wrapper) {
            this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function() {
            var totalWeightLifted = 0;
            this.$wrapper.find('tbody tr').each(function() {
                totalWeightLifted += $(this).data('weight');
            });

            return totalWeightLifted;
        }
    });
    
})(window, jQuery);