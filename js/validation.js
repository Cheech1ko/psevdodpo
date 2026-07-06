
const RULES = {
    name: {
        test: (value) => {
            const v = value.trim();
            if (v.length < 2) return false;
            // только буквы (кириллица/латиница), пробелы и дефис
            return /^[A-Za-zА-Яа-яЁё\s-]+$/.test(v);
        },
        message: 'Введите имя (минимум 2 буквы, без цифр)',
    },
    phone: {
        test: (value) => {
            const digits = value.replace(/[^\d+]/g, '');
            // должен начинаться с +7 и содержать ровно 10 цифр после +7
            return /^\+7\d{10}$/.test(digits);
        },
        message: 'Телефон должен начинаться с +7 и содержать 10 цифр, например +7 (999) 123-45-67',
    },
};

const showError = (input, message) => {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.add('has-error');
    const errBox = field.querySelector('.field-error');
    if (errBox) errBox.textContent = message;
};

const clearError = (input) => {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    const errBox = field.querySelector('.field-error');
    if (errBox) errBox.textContent = '';
};

const validateField = (input) => {
    const ruleName = input.getAttribute('data-rule');
    if (!ruleName || !RULES[ruleName]) return true;

    const value = input.value || '';

    if (input.hasAttribute('required') && value.trim() === '') {
        showError(input, 'Это поле обязательно для заполнения');
        return false;
    }

    const rule = RULES[ruleName];
    if (!rule.test(value)) {
        showError(input, rule.message);
        return false;
    }

    clearError(input);
    return true;
};

const validateForm = (form) => {
    const inputs = form.querySelectorAll('[data-rule]');
    let isValid = true;
    inputs.forEach((input) => {
        if (!validateField(input)) isValid = false;
    });
    return isValid;
};

// Автоформатирование телефона: гарантируем, что поле начинается с +7
const attachPhoneMask = (input) => {
    input.addEventListener('focus', () => {
        if (input.value.trim() === '') input.value = '+7 ';
    });

    input.addEventListener('input', () => {
        const v = input.value;
        // не даём стереть +7 в начале, если пользователь начал вводить с другой цифры
        if (v.length === 1 && v !== '+') {
            input.value = `+7 ${v}`;
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {

    // ── Инициализация полей с правилами валидации ──
    document.querySelectorAll('[data-rule]').forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));

        if (input.getAttribute('data-rule') === 'phone') {
            attachPhoneMask(input);
        }
    });

    // ── Обработка отправки форм ──
    document.querySelectorAll('form.js-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm(form)) {
                const target = form.querySelector('.has-error input');
                target?.focus();
                return;
            }

            const message = form.getAttribute('data-success') || 'Спасибо! Заявка отправлена.';
            alert(message);
            form.reset();

            form.querySelectorAll('.field').forEach((f) => f.classList.remove('has-error'));
            form.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });

            if (form.getAttribute('data-modal') === 'true') {
                closeModal?.();
            }
        });
    });

});