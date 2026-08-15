<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-copy">
          <p>&copy; {{ new Date().getFullYear() }} AI CRO Auditor.IlyaGovoruxin {{ $t('footer.rights') }}</p>
        </div>
        <div class="footer-links">
          <router-link to="/offer">{{ $t('footer.offer') }}</router-link>
          <router-link to="/contacts">{{ $t('footer.contacts') }}</router-link>
          <router-link to="/privacy">{{ $t('footer.privacy') }}</router-link>
          <router-link to="/requisites">{{ $t('footer.requisites') }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
$dark: #1a1a2e;

.footer {
  background: $dark;
  color: rgba(255, 255, 255, 0.7);
  padding: 32px 0;
  margin-top: auto;
  width: 100%;

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-copy {
    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
  }

  .footer-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;

    a {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #ffffff;
      }
    }
  }
}

// ===== АДАПТИВ =====

@media (max-width: 768px) {
  .footer {
    padding: 24px 0;

    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }

    .footer-links {
      justify-content: center;
      gap: 16px;
    }

    .footer-copy p {
      font-size: 0.8rem;
    }

    .footer-links a {
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 18px 0;

    .footer-links {
      flex-direction: column;
      gap: 8px;
    }

    .footer-copy p {
      font-size: 0.7rem;
    }

    .footer-links a {
      font-size: 0.7rem;
    }
  }
}
</style>