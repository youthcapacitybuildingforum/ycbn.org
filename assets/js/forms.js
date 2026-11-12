/**
 * YCBN — Shared Form Handler
 * Used by donate.html, volunteer.html and partnerships.html.
 *
 * Posts to the same Google Apps Script endpoint already proven by contact.html,
 * using a hidden iframe so the submission never navigates the visitor away.
 * The `form_type` field tells the Apps Script which sheet/section the entry
 * belongs to (donation_pledge / volunteer / partnership).
 */
(function () {
    'use strict';

    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwnLsJgNVJcJLQXJ8pGmhjzhnOmlZBM76uvwOgzdquBpKfPB15A3cbYEPcDganeHqRtjQ/exec';

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showStatus(el, text, ok) {
        if (!el) return;
        el.textContent = text;
        // classList.add() accepts ONE token per argument. Passing a
        // space-separated string throws InvalidCharacterError and aborts the
        // handler, so add the semantic status class as a single token.
        el.classList.remove('hidden', 'form-status--error', 'form-status--success',
            'bg-emerald-500/20', 'text-emerald-300', 'bg-red-500/20', 'text-red-300');
        el.classList.add(ok ? 'form-status--success' : 'form-status--error');
    }

    function postToEndpoint(formType, fields, done) {
        var iframe = document.getElementById(formType + 'HiddenFrame');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = formType + 'HiddenFrame';
            iframe.name = formType + 'HiddenFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        var hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = ENDPOINT;
        hiddenForm.target = formType + 'HiddenFrame';
        hiddenForm.style.display = 'none';

        var payload = { form_type: formType };
        Object.keys(fields).forEach(function (key) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key] == null ? '' : fields[key];
            hiddenForm.appendChild(input);
        });
        document.body.appendChild(hiddenForm);

        var finished = false;
        var finish = function () {
            if (finished) return;
            finished = true;
            if (hiddenForm.parentNode) hiddenForm.parentNode.removeChild(hiddenForm);
            done();
        };

        iframe.addEventListener('load', finish, { once: true });
        setTimeout(finish, 10000);
        hiddenForm.submit();
    }

    function initForm(config) {
        var form = document.getElementById(config.formId);
        if (!form) return;

        var status = document.getElementById(config.statusId);
        var btn = document.getElementById(config.buttonId);
        var btnLabel = btn ? btn.querySelector('span') : null;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var values = {};
            var firstInvalid = null;

            // Read every input/select/textarea that carries a data-field name.
            Array.prototype.forEach.call(form.querySelectorAll('[data-field]'), function (el) {
                var key = el.getAttribute('data-field');
                var val;
                if (el.type === 'checkbox') {
                    val = el.checked ? 'Yes' : 'No';
                } else {
                    val = (el.value || '').trim();
                }
                values[key] = val;

                var required = el.hasAttribute('required');
                var isEmail = el.type === 'email';

                if (required && !val && !firstInvalid) firstInvalid = el;
                if (isEmail && val && !EMAIL_RE.test(val) && !firstInvalid) firstInvalid = el;
            });

            if (firstInvalid) {
                showStatus(status, config.invalidMessage || 'Please complete all required fields before submitting.', false);
                firstInvalid.focus();
                return;
            }

            if (btn) btn.disabled = true;
            if (btnLabel) btnLabel.textContent = config.sendingLabel || 'Sending...';
            if (status) status.classList.add('hidden');

            postToEndpoint(config.formType, values, function () {
                form.reset();
                if (btn) btn.disabled = false;
                if (btnLabel) btnLabel.textContent = config.buttonLabel || 'Submit';
                showStatus(status, config.successMessage || 'Thank you! Your submission has been received.', true);
            });
        });
    }

    function boot() {
        initForm({
            formId: 'donationForm',
            statusId: 'donationStatus',
            buttonId: 'donationBtn',
            formType: 'donation_pledge',
            invalidMessage: 'Please enter your name, a valid email address and the amount you would like to give.',
            sendingLabel: 'Submitting...',
            buttonLabel: 'Submit Donation Pledge',
            successMessage: 'Thank you! Your donation pledge has been received. We will email you instructions for completing your transfer within 2 working days.'
        });

        initForm({
            formId: 'volunteerForm',
            statusId: 'volunteerStatus',
            buttonId: 'volunteerBtn',
            formType: 'volunteer',
            invalidMessage: 'Please complete all required fields so we can match you to the right opportunity.',
            sendingLabel: 'Sending...',
            buttonLabel: 'Submit Application',
            successMessage: 'Thank you! Your volunteer application has been received. Our team will review it and contact you within 5 working days.'
        });

        initForm({
            formId: 'partnershipForm',
            statusId: 'partnershipStatus',
            buttonId: 'partnershipBtn',
            formType: 'partnership',
            invalidMessage: 'Please provide your organisation name, a valid email address and a short description of the collaboration you have in mind.',
            sendingLabel: 'Sending...',
            buttonLabel: 'Send Partnership Inquiry',
            successMessage: 'Thank you! Your partnership inquiry has been received. We will respond within 5 working days.'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
