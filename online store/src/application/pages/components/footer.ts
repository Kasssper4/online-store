import Component from '../../patterns/component';

class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'footer__wrapper';

        const gitwrapper = document.createElement('div');
        gitwrapper.className = 'footer__git';
        gitwrapper.innerHTML = `<a href = 'https://github.com/DianaSmertina' class = 'footer__link'>\
                                  <div class = 'git-logo'></div>\
                                  <p class = 'author'>Diana Smertina 2022</p>\
                                </a>`;

        const rsWrapper = document.createElement('div');
        rsWrapper.className = 'footer__rs';
        rsWrapper.innerHTML = `<a href = 'https://rs.school/js/' class = 'footer__link'>\
                                <div class = 'rs-logo'></div>\
                              </a>`;

        wrapper.append(gitwrapper, rsWrapper);
        this.container.append(wrapper);
        return this.container;
    }
}

export default Footer;
