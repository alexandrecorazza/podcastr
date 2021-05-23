import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string,
            header: string,
            lines: string,
            textDefault: string,
            textAlternative: string,
            columnName: string,
            textEpisodes: string,
            buttonBorder: string
        }
    }
}