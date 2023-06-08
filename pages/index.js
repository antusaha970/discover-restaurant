import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner/Banner";
import Image from "next/image";
import Card from "../components/Card/Card";
import { fetchCoffeeStores } from "../lib/coffee-store";
import userLocation from "../hooks/user-track";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPE, StoreContext } from "./_app";

export const getStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();
  return { props: { coffeeStores } };
};

export default function Home(props) {
  const { handleTrackLocation, locationError, isLocating } = userLocation();
  const { state, dispatch } = useContext(StoreContext);
  const { latLong, coffeeStores } = state;
  const [coffeeStoreError, setCoffeeStoreError] = useState(null);
  const handleBannerButtonClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStore?latLong=${latLong}&limit=20`
          );
          const coffeeStores = await response.json();
          console.log(coffeeStores);
          console.log(coffeeStores);
          dispatch({
            type: ACTION_TYPE.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
        } catch (error) {
          console.error({ error });
          setCoffeeStoreError(error.message);
        }
      }
    }
    fetchData();
  }, [latLong]);

  const imgUrl =
    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";
  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurant Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isLocating ? "loading" : "view nearby coffee shops"}
          handleClick={handleBannerButtonClick}
        />
        {locationError && <p>Unable to locate your location</p>}
        {coffeeStoreError && <p>Unable to load coffee stores</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee Store near me</h2>
            <div className={styles.gridContainer}>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    imgUrl={coffeeStore.imgUrl || imgUrl}
                    name={coffeeStore.name}
                    className={styles.card}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Restaurants nearby Dhaka</h2>

            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  href={`/coffee-store/${coffeeStore.id}`}
                  imgUrl={coffeeStore.imgUrl || imgUrl}
                  name={coffeeStore.name}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
