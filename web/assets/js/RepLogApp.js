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
            var formData = {};
            $.each($form.serializeArray(), function(key,field){
                formData[field.name] = field.value;
            });
            console.log(formData, $form.serialize());
            $.ajax({
                url: $form.data('url'),
                method: 'POST',
                data: JSON.stringify(formData),
                success: function(dataresp) {
                    // todo
                    console.log('success');
                },
                error: function(jqXHR) {
                    // todo
                    console.log('error');
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