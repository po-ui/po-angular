export const poPageBlockedUserLiterals = {
  none: {
    pt: {
      title: 'Opa!',
      firstPhrase: 'Tivemos que bloquear essa tela temporariamente.',
      secondPhrase: 'Mas não se preocupe! Basta fazer seu login novamente.'
    },
    en: {
      title: 'Oops!',
      firstPhrase: 'We had to temporarily block this screen.',
      secondPhrase: 'But do not worry! Just sign in again.'
    },
    es: {
      title: 'Opa!',
      firstPhrase: 'Tuvimos que bloquear esta pantalla temporalmente.',
      secondPhrase: '¡Pero no se preocupe! Sólo tienes que iniciar sesión de nuevo.'
    },
    ru: {
      title: 'Ой!',
      firstPhrase: 'Нам пришлось временно заблокировать этот раздел.',
      secondPhrase: 'Но не волнуйтесь! Просто войдите в систему еще раз.'
    }
  },
  exceededAttempts: {
    pt: {
      title: 'Opa!',
      firstPhrase: `Para sua segurança, após {0} tentativa(s) de senha seu usuário fica bloqueado e não pode ser acessado em {1} hora(s) :( `,
      secondPhrase: 'Isso é para evitar que hackers invadam sua conta.',
      thirdPhrase:
        'Mas não se preocupe! Se você for o dono da conta e apenas esqueceu sua senha, basta entrar em contato com o suporte.'
    },
    en: {
      title: 'Oops!',
      firstPhrase: `For your security, after {0} attempt(s) of password
        your user gets blocked and can not be accessed in {1} hour(s) :(`,
      secondPhrase: 'This is to prevent hackers from hacking into your account.',
      thirdPhrase:
        'But do not worry! If you are the owner of the account and just forgot your password, just contact support.'
    },
    es: {
      title: 'Opa!',
      firstPhrase: `Para su seguridad, después de {0} intento(s) de contraseña
        su usuario queda bloqueado y no puede ser accedido en {1} hora(s) :(`,
      secondPhrase: 'Esto es para evitar que los hackers invadan su cuenta.',
      thirdPhrase: `¡Pero no se preocupe! Si usted es el dueño de la cuenta
        y acaba de olvidar su contraseña, simplemente póngase en contacto con el soporte.`
    },
    ru: {
      title: 'Ой!',
      firstPhrase:
        'Для вашей безопасности, после {0} попыток ввода пароля\r\nваш пользователь блокируется и не сможет авторизоваться в течение {1} часа(ов) :(',
      secondPhrase: 'Это делается для того, чтобы хакеры не могли взломать ваш аккаунт.',
      thirdPhrase:
        'Но не волнуйтесь! Если вы являетесь владельцем учетной записи и просто забыли свой пароль, обратитесь в службу поддержки.'
    }
  },
  expiredPassword: {
    pt: {
      title: 'Opa! Sua senha expirou',
      firstPhrase: `A cada {0} dia(s) é preciso criar uma nova senha por questão de segurança. Após esses {0} dia(s) seu acesso é bloqueado :(`,
      secondPhrase: 'Mas não se preocupe! Basta entrar em contato com o administrador do sistema.'
    },
    en: {
      title: 'Oops! Your Password has expired',
      firstPhrase: `Every {0} day(s) you need to create a new password for security reasons.
        After these {0} day(s) your access is blocked :(`,
      secondPhrase: 'But do not worry! Just contact your system administrator.'
    },
    es: {
      title: 'Opa! Su contraseña ha caducado',
      firstPhrase: `Cada {0} día(s) es necesario crear una nueva contraseña por razones de seguridad.
        Después de estos {0} día(s) su acceso está bloqueado :(`,
      secondPhrase: '¡Pero no se preocupe! Sólo tienes que ponerse en contacto con el administrador del sistema.'
    },
    ru: {
      title: 'Ой! Срок действия вашего пароля истек',
      firstPhrase:
        'Каждые {0} дней вам необходимо создавать новый пароль в целях безопасности.\r\nПосле {0} дней ваш доступ будет заблокирован :(',
      secondPhrase: 'Но не волнуйтесь! Просто обратитесь к своему системному администратору.'
    }
  }
};
