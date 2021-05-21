import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
import styles from './styles.module.scss'
import Switch from 'react-switch'

interface HeaderProps {
  toggleTheme(): void,
  theme: string
}

export function Header(props) {
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
      >
      </Switch>
      <span>{currentDate}</span>
    </header>
  )
}