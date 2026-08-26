#!/usr/bin/env ucode
'use strict';

import { glob } from 'fs';

const methods = {
	get_status: {
		call: function() {
			return {
				enabled: (glob('/etc/rc.d/S??nook').length > 0),
				running: (system([ '/etc/init.d/nook', 'running' ]) === 0)
			};
		}
	},

	service_action: {
		args: { action: 'action' },
		call: function(req) {
			const valid = [ 'start', 'stop', 'restart', 'reload', 'enable', 'disable' ];
			let action = (req && req.args && req.args.action) ? req.args.action : '';

			if (index(valid, action) < 0)
				return { success: false, error: 'invalid action' };

			let exit = system([ '/etc/init.d/nook', action ]);

			return { success: (exit === 0), exit_code: exit };
		}
	}
};

return { 'luci.nook': methods };
