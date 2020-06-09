import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Videos, setVideos] = useState({})

    useEffect(() => {
        axios.get('/api/video/getVideos')
        .then(response => {
          if (response.data.success) {
              //console.log(response);
              setVideos(response.data.videos);
          } else {
            alert('비디오 가져오기를 실패 했습니다.');
          }
        })
    }, [])


    const renderCards = Videos.map((v) => {
        console.log(v);
        return v;
    })


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />

            <Row gutter={16}>

            </Row>
        </div>
    )
}

export default LandingPage
