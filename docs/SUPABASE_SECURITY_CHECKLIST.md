# Checklist de segurança Supabase

Itens que precisam ser configurados manualmente no Dashboard do Supabase (não são alterações de código).

## Autenticação (Auth)

- [ ] **Leaked password protection**  
  Ativar em: **Dashboard → Authentication → Settings → Password Protection**.  
  O Supabase verifica senhas contra HaveIBeenPwned.org para bloquear senhas comprometidas.  
  [Documentação](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
