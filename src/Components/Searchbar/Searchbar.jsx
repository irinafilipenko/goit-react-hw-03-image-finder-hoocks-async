import s from './Searchbar.module.css'

export const SearchBar = ({ onSearch }) => {
  const handleSearch = (e) => {
    e.preventDefault()

    onSearch(e.target.elements.pictureName.value)

    e.target.elements.pictureName.value = ' '
  }

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleSearch}>
        <button type="submit" className={s.SearchForm_button}>
          <span className={s.SearchForm_button_label}>Search</span>
        </button>

        <input
          className={s.SearchForm_input}
          type="text"
          autoComplete="off"
          autoFocus
          name="pictureName"
          //   value={this.state.pictureName}
          placeholder="Search images and photos"
          //   onChange={this.handleNameChange}
        />
      </form>
    </header>
  )
}
