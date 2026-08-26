'use strict';
'require view';
'require form';
'require uci';
'require ui';
'require rpc';

const callGetStatus = rpc.declare({
	object: 'luci.nook',
	method: 'get_status'
});

const callServiceAction = rpc.declare({
	object: 'luci.nook',
	method: 'service_action',
	params: ['action']
});

return view.extend({
	load: function() {
		return L.resolveDefault(callGetStatus(), { enabled: false, running: false });
	},

	render: function(status) {
		let m, s, o;
		let bootEnabled = status.enabled || false;

		m = new form.Map('nook');

		/*
			Title section
		*/
		s = m.section(form.NamedSection, 'title');
		s.render = function() {
			return E('div', { 'class': 'cbi-section' }, [
				E('h2', {}, _('Nook')),
				E('p', {}, _('LAN collaboration service running on this device.'))
			]);
		};

		/*
			Configuration management section
		*/
		s = m.section(form.NamedSection, 'main', 'nook', _('Configuration'));
		s.addremove = false;

		s.render = function() {
			const self = this;

			return self.renderUCISection('main').then(function(nodes) {
				const bootBtn = E('button', {
					'class': 'btn cbi-button ' + (bootEnabled ? 'cbi-button-remove' : 'cbi-button-action'),
					'id': 'nook-boot-btn',
					'click': function(ev) {
						const action = bootEnabled ? 'disable' : 'enable';
						const btn = ev.target;

						btn.disabled = true;
						btn.textContent = _('Processing...');

						L.resolveDefault(callServiceAction(action), {}).then(function(res) {
							if (res && res.success) {
								bootEnabled = !bootEnabled;
								ui.addTimeLimitedNotification(null, E('p',
									bootEnabled ? _('Enabled start at boot.') : _('Disabled start at boot.')
								), 5000, 'notice');
							} else {
								const errMsg = res && (res.error || res.message || (res.exit_code !== undefined ? 'Exit code: ' + res.exit_code : JSON.stringify(res)));
								ui.addTimeLimitedNotification(null, E('p', _('Failed: ') + errMsg), 5000, 'error');
							}
						}).catch(function(err) {
							ui.addTimeLimitedNotification(null, E('p', _('Error: ') + err.message), 5000, 'error');
						}).finally(function() {
							btn.disabled = false;
							btn.textContent = bootEnabled ? _('Disable at Boot') : _('Enable at Boot');
							btn.className = 'btn cbi-button ' + (bootEnabled ? 'cbi-button-remove' : 'cbi-button-action');
						});
					}
				}, bootEnabled ? _('Disable at Boot') : _('Enable at Boot'));

				const bootRow = E('div', { 'class': 'cbi-value' }, [
					E('label', { 'class': 'cbi-value-title' }, _('Start at Boot')),
					E('div', { 'class': 'cbi-value-field' }, bootBtn)
				]);

				return E('fieldset', { 'class': 'cbi-section' }, [
					E('legend', {}, _('Configuration')),
					bootRow
				].concat(nodes));
			});
		};

		o = s.option(form.Flag, 'enabled', _('Enabled'), _('Start the Nook service.'));
		o.rmempty = false;

		o = s.option(form.Value, 'listen', _('Listen Address'), _('Listening address in host:port format.'));
		o.placeholder = '0.0.0.0:8088';
		o.rmempty = false;
		o.validate = function(section_id, value) {
			if (!value || !/^.+:\d{1,5}$/.test(value))
				return _('Invalid listen address. Expected format: host:port');
			return true;
		};

		return m.render();
	}
});
