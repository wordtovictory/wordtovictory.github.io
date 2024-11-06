import React from 'react';
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/instagram'
import 'react-social-icons/facebook'
import 'react-social-icons/youtube'

export default function Footer() {
    return (
        <footer>
            <h1>More about BibleTrack</h1>
            <p>About</p>
            <p>Contact</p>
            <SocialIcon bgColor="white" fgColor="#0099ff" url="www.instagram.com"/>
            <SocialIcon bgColor="white" fgColor="#0099ff" url="www.facebook.com"/>
            <SocialIcon bgColor="white" fgColor="#0099ff" url="www.youtube.com"/>

            <p>© 2024 BibleTrack. All Rights Reserved.</p>
        </footer>
    );
};
