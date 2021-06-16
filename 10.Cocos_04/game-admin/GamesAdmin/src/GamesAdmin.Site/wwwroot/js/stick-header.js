class StickHeader {    
    stick(parentSelector, tableSelector, baseOffset, stickOffset) {
        $(parentSelector).scroll(function () {
            const offset = $(this).scrollTop();
            const table = $(tableSelector);
            const rows = table.find(' thead tr');
            const rHeights = [];

            table.css({ borderCollapse: 'separate', borderSpacing: 0 });
            rows.each((i, r) => rHeights.push($(r).height()))
            for (var i = 0; i < rows.length; i++) {
                const row = $(rows[i]);
                const ths = row.find(' th');

                const addedHeight = rHeights.reduce((sum, value, index) => {
                    if (index < i) {
                        sum += value;
                    }

                    return sum;
                }, 0);

                row.css({ zIndex: 999 });
                if (offset > baseOffset) {
                    ths.css({
                        position: 'sticky',
                        top: stickOffset + addedHeight + "px",
                        zIndex: 999
                    });
                }
                else {
                    ths.css({ position: 'static' });
                }
            }
        });
    }
}

var stickHeader = new StickHeader();
//stickHeader.stick('.inner-content', 'table#status-tbl', 120, -20);
