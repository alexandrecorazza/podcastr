import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
import styles from './styles.module.scss'
import Switch from 'react-switch'

interface HeaderProps {
  toggleTheme(): void,
  theme: string
}

export function Header(props: HeaderProps) {
  //const currentDate = new Date().toLocaleDateString()   > seria a forma tradicional do js
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBr,
  })

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />
      {/* Todo arquivo que está dentro da pasta public, automaticamente é público. Então podemos chamá-lo passando
            diretamente o endereço / */}
      <p>O melhor para você ouvir, sempre</p>
      <Switch
        onChange={props.toggleTheme}
        checked={props.theme === 'dark' ? true : false}
        className={styles.switch}
        checkedIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 20,
          }}
        >
          🌜
        </div>}
        uncheckedIcon={<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 20,
          }}
        >
          🌞
        </div>}
        onColor='#4d4d4d'
        boxShadow="0px 1px 3px #04D361"
        activeBoxShadow="0px 0px 1px 10px #04D361"
      >
      </Switch>
      <span>{currentDate}</span>
    </header>
  )
}