declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_I18N_CONFIG_PATH: string;
    readonly NEXT_PUBLIC_ENV: string;
    readonly NEXT_PUBLIC_CONSOLE_LOG_LEVEL: string;
    readonly NEXT_PUBLIC_SENTRY_LOG_LEVEL: string;
    readonly NEXT_PUBLIC_SENTRY_DSN: string;
    readonly NEXT_PUBLIC_GAME_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_SICBO_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_SICBO_SERVER_PROXY_ROUTE: string;
    readonly NEXT_PUBLIC_TAIXIU_ORDER: string;
    readonly NEXT_PUBLIC_CHANLE_ORDER: string;
    readonly NEXT_PUBLIC_TAI_XIU_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_TAI_XIU_TURBO_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_CHAN_LE_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_CHAN_LE_TURBO_SERVER_ENDPOINT: string;
    readonly NEXT_PUBLIC_BINARY_GAMES_SERVER_PROXY_ROUTE: string;
  }
}
