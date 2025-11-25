import Inputmask from "inputmask";

function sendMail(selector) {
  let formData = new FormData($(selector).get(0));
  return fetch('#p', {
    method: 'POST',
    body: formData
  });
};

export default function sendForm() {

  const validateName = (name) => {
    if (name.length >= 2 && name.length < 50) {
      return name.match(
        /^[а-яА-Я]/
      );
    }
  }

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validatePhone = (phone) => {
    return phone.match(
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
    );
  }

  const validatedName = () => {
    const name = $('input[name="name"]').val();
    const surname = $('input[name="surname"]').val();

    if (validateName(name)) {
      $('input[name="name"]').removeClass('error');
    } else {
      $('input[name="name"]').addClass('error');
    }
    if (name == 0) {
      $('input[name="name"]').removeClass('error');
    }
    if (validateName(surname)) {
      $('input[name="surname"]').removeClass('error');
    } else {
      $('input[name="surname"]').addClass('error');
    }
    if (surname == 0) {
      $('input[name="surname"]').removeClass('error');
    }
    return false;
  }

  const validatedEmail = () => {
    const email = $('input[name="email"]').val();

    if (validateEmail(email)) {
      $('input[name="email"]').removeClass('error');
    } else {
      $('input[name="email"]').addClass('error');
    }
    if (email == 0) {
      $('input[name="email"]').removeClass('error');
    }
    return false;
  }

  const validatedPhone = () => {
    const phone = $('input[name="phone"]').val();

    if (validatePhone(phone) && phone.length > 0 || phone.length == '') {
      $('input[name="phone"]').removeClass('error');
    } else {
      $('input[name="phone"]').addClass('error');
      $('.contact-button').addClass('disabled');
    }
    if (phone.length == '') {
      $('.contact-button').addClass('disabled');
    }
    return false;
  }

  $('input[name="name"]').on('input', validatedName);
  $('input[name="surname"]').on('input', validatedName);
  $('input[name="email"]').on('input', validatedEmail);
  $('input[name="phone"]').on('input', validatedPhone);

  function sendPopupForm() {
    let form = $('.contact-form');
    if (form) {
      form.on('submit', function(e) {
        e.preventDefault();
        if (!$('.contact-form input').hasClass('error')) {
          sendMail(form).then(function() {
            form.get(0).reset();
            $('.contact-form input').removeClass('error');
            $('.contact-button').text('Sent!');
            setTimeout(function() {
              $('.contact-button').text('Send message');
              $('.contact-button').addClass('disabled');
            }, 2000);
          });
        } else {
          $('.contact-button').text('Error!');
          setTimeout(function() {
            $('.contact-button').text('Send message');
          }, 2000);
        }
      });
    }
  }
  sendPopupForm();

  function inputMask() {
    let input =  $('input[type="tel"]');
    Array.from(input).forEach(function(element) {
      let mask = new Inputmask('+7 (999) 999-99-99');
      mask.mask(element);
    });
  }
  inputMask();
}
setTimeout(function() {
  sendForm();
}, 100);