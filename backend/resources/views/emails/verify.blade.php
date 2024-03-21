<x-mail::message>
# Email Verification

Dear {{ $username }},

Thank you for registering  to {{ config('app.name') }}. Please verify your email address to activate your account.

Click the following link to verify your email:
<a href="{{ $verificationUrl }}">Verify Email</a>

If you did not create a {{ config('app.name') }} account, no further action is required.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>