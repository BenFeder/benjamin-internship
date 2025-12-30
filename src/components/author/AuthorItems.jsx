import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NftItem from "../UI/NftItem";

const AuthorItems = ({ authorId }) => {
  const [authorItems, setAuthorItems] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthorItems(response.data.nftCollection || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching author items:", error);
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorItems();
    }
  }, [authorId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      authorItems.forEach((item) => {
        const now = Date.now();
        const timeLeft = item.expiryDate - now;

        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[item.nftId] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newCountdowns[item.nftId] = "Expired";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [authorItems]);

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {loading
            ? new Array(8).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div>Loading...</div>
                </div>
              ))
            : authorItems.map((item) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.nftId}>
                  <NftItem item={item} countdown={countdowns[item.nftId]} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
