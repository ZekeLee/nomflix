import { useState, useEffect, useRef } from 'react';
import { Link, useMatch } from 'react-router-dom';

import styled from 'styled-components';
import { motion, useAnimation, useScroll } from 'framer-motion';

const HeaderEl = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 2rem;
  width: 100%;
  font-size: 0.875rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 1.5rem;
  height: 1.5rem;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Dot = styled(motion.span)`
  position: absolute;
  bottom: -0.75rem;
  left: calc(50% - 0.25rem);
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${(props) => props.theme.red};
  border-radius: 50%;
`;

const Search = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  &.active {
    padding: 0.5rem;
    border: 1px solid ${(props) => props.theme.white.darker};
  }
  button {
    height: 100%;
  }
  svg {
    height: 1.5rem;
    color: ${(props) => props.theme.white.darker};
  }
`;

const Input = styled(motion.input)`
  height: 100%;
  transform-origin: right;
`;

const logoVariants = {
  normal: {
    opacity: 1,
  },
  active: {
    opacity: 1,
  },
};

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const homeMatch = useMatch('');
  const tvMatch = useMatch('tv');

  const headerRef = useRef();

  const headerAnimation = useAnimation();
  const inputAnimation = useAnimation();

  const { scrollY } = useScroll();

  const toggleSearch = () => {
    if (isSearchActive) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setIsSearchActive((prev) => !prev);
  };

  useEffect(() => {
    scrollY.onChange(() => {});
  }, [scrollY]);

  return (
    <HeaderEl ref={headerRef} initial={{ backgroundColor: 'rgba(0, 0, 0, 1' }}>
      <Nav>
        <Col>
          <Link to="">
            <Logo
              xmlns="http://www.w3.org/2000/svg"
              height="276.742"
              viewBox="0 0 1024 276.742"
              variants={logoVariants}
              initial="normal"
              whileHover="active"
            >
              <motion.path
                xmlns="http://www.w3.org/2000/svg"
                d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
                fill="#d81f26"
              />
            </Logo>
          </Link>
          <Items>
            <Item>
              <Link to="">Home</Link>
              {homeMatch && <Dot layoutId="dot" />}
            </Item>
            <Item>
              <Link to="tv">Tv Shows</Link>
              {tvMatch && <Dot layoutId="dot" />}
            </Item>
          </Items>
        </Col>
        <Col>
          <Search
            className={'' + (isSearchActive ? 'active' : null)}
            initial={{ width: '1.5rem' }}
            animate={{ width: isSearchActive ? 'auto' : '1.5rem' }}
            transition={{ type: 'linear' }}
          >
            <button type="button" onClick={toggleSearch}>
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
              </svg>
            </button>
            <Input
              type="text"
              initial={{ scaleX: 0 }}
              animate={inputAnimation}
              transition={{ type: 'linear' }}
              placeholder="Search for movie or tv show..."
            />
          </Search>
        </Col>
      </Nav>
    </HeaderEl>
  );
};

export default Header;
