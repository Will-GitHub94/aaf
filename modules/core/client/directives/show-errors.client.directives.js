/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core').directive('showErrors', ['$timeout', '$interpolate', ($timeout, $interpolate) => {
	let linkFn = (scope, el, attrs, formCtrl) => {
		let inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
			initCheck = false,
			showValidationMessages = false,
			blurred = false;

		options = scope.$eval(attrs.showErrors) || {};
		showSuccess = options.showSuccess || false;
		inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
		inputNgEl = angular.element(inputEl);
		inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

		if (!inputName) {
			throw 'show-errors element has no child input elements with a \'name\' attribute class';
		}

		let reset = () => {
			return $timeout(() => {
				el.removeClass('has-error');
				el.removeClass('has-success');
				showValidationMessages = false;
			}, 0, false);
		};

		scope.$watch(() => {
			return formCtrl[inputName] && formCtrl[inputName].$invalid;
		}, (invalid) => {
			return toggleClasses(invalid);
		});

		scope.$on('show-errors-check-validity', (event, name) => {
			if (angular.isUndefined(name) || formCtrl.$name === name) {
				initCheck = true;
				showValidationMessages = true;

				return toggleClasses(formCtrl[inputName].$invalid);
			}
		});

		scope.$on('show-errors-reset', (event, name) => {
			if (angular.isUndefined(name) || formCtrl.$name === name) {
				return reset();
			}
		});

		toggleClasses = (invalid) => {
			el.toggleClass('has-error', showValidationMessages && invalid);
			if (showSuccess) {
				return el.toggleClass('has-success', showValidationMessages && !invalid);
			}
		};
	};

	return {
		restrict: 'A',
		require: '^form',
		compile: (elem, attrs) => {
			if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
				if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
					throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
				}
			}
			return linkFn;
		}
	};
}]);
