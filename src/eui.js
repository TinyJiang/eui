define(['eui/comps/grid/grid', 'eui/effects/mask'], function(grid, mask) {
			var eui = function() {
			};

			grid.register(eui.prototype);
			mask.register(eui.prototype);

			return new eui();
		});