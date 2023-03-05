import { InnerContainer, PageContainer, PageContents } from './styles';
import { router } from '../../ConnectKit';
import { signal } from '@preact/signals-react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type PageProps = {
  open: boolean;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ children, open }) => {
  if (!open) return null;
  return <PageContainer>{children}</PageContainer>;
};

type ModalContentProps = {
  pages: any;
  children: React.ReactNode;
};

const dimensions = signal({ width: 0, height: 0 });

const PagesContainer = styled(motion.div)``;

const ModalInner: React.FC<ModalContentProps> = ({ pages, children }) => {
  const pageId = router.value;
  const contentRef = useRef<any>(null);
  useEffect(() => {
    const bounds = contentRef.current?.getBoundingClientRect();
    dimensions.value = {
      width: bounds?.width || 0,
      height: bounds?.height || 0,
    };
  }, [pageId]);

  console.log('Render');

  return (
    <InnerContainer
      animate={{
        width: dimensions.value.width,
        height: dimensions.value.height,
      }}
      transition={{
        ease: [0.16, 1, 0.3, 1],
        duration: 0.25,
      }}
    >
      {children}
      <PagesContainer ref={contentRef}>
        {Object.keys(pages).map((key) => {
          const page = pages[key];
          return (
            // TODO: We may need to use the follow check avoid unnecessary computations, but this causes a bug where the content flashes
            // (key === pageId || key === prevPage) && (
            <Page key={key} open={key === pageId}>
              <PageContents key={`inner-${key}`}>{page}</PageContents>
            </Page>
          );
        })}
      </PagesContainer>
    </InnerContainer>
  );
};

export default ModalInner;
