package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
)

func sentMessage(s *discordgo.Session, m *discordgo.MessageSend, c *string) error {
	_, err := s.ChannelMessageSendComplex(*c, m)
	if err != nil {
		log.Println("Error sending message: ", err)
	}
	return err
}

func handleVoiceStateUpdate(s *discordgo.Session, v *discordgo.VoiceStateUpdate, Guild *string, Channel *string) {

	// User joined voice channel
	if v.BeforeUpdate == nil {
		if v.VoiceState.GuildID == *Guild {
			// 	log.Println("User joined voice channel")
			sentMessage(s, &discordgo.MessageSend{
				Content:         fmt.Sprintf("<@%s> joined <#%s> at <t:%d:R>", v.VoiceState.UserID, v.VoiceState.ChannelID, time.Now().Unix()),
				AllowedMentions: &discordgo.MessageAllowedMentions{},
			}, Channel)
		}
		return
	}

	// User left voice channel
	if v.VoiceState.ChannelID == "" {
		if v.BeforeUpdate.GuildID == *Guild {
			// log.Println("User left voice channel")
			sentMessage(s, &discordgo.MessageSend{
				Content:         fmt.Sprintf("<@%s> left <#%s> at <t:%d:R>", v.BeforeUpdate.UserID, v.BeforeUpdate.ChannelID, time.Now().Unix()),
				AllowedMentions: &discordgo.MessageAllowedMentions{},
			}, Channel)
		}
		return
	}

	if v.VoiceState.GuildID != *Guild || v.BeforeUpdate.GuildID != *Guild {
		return
	}

	// User switched voice channel
	if v.BeforeUpdate.ChannelID != v.VoiceState.ChannelID {
		// log.Println("User switched voice channel")
		sentMessage(s, &discordgo.MessageSend{
			Content:         fmt.Sprintf("<@%s> switched <#%s> at <t:%d:R>", v.UserID, v.ChannelID, time.Now().Unix()),
			AllowedMentions: &discordgo.MessageAllowedMentions{},
		}, Channel)
		return
	}

	// User stated/stoped streaming voice channel
	if v.BeforeUpdate.SelfStream != v.VoiceState.SelfStream {
		var action string = "undefined"
		if v.VoiceState.SelfStream {
			// log.Println("User started stream")
			action = "started streaming"
		} else {
			// log.Println("User stopped stream")
			action = "stopped streaming"
		}
		sentMessage(s, &discordgo.MessageSend{
			Content:         fmt.Sprintf("<@%s> %s in <#%s> at <t:%d:R>", v.UserID, action, v.ChannelID, time.Now().Unix()),
			AllowedMentions: &discordgo.MessageAllowedMentions{},
		}, Channel)
		return
	}

	//User turn on/off video
	if v.BeforeUpdate.SelfVideo != v.VoiceState.SelfVideo {
		var action string = "undefined"
		if v.VoiceState.SelfVideo {
			// log.Println("User turn on video")
			action = "turn on video"
		} else {
			// log.Println("User turn off video")
			action = "turn off video"
		}
		sentMessage(s, &discordgo.MessageSend{
			Content:         fmt.Sprintf("<@%s> %s in <#%s> at <t:%d:R>", v.UserID, action, v.ChannelID, time.Now().Unix()),
			AllowedMentions: &discordgo.MessageAllowedMentions{},
		}, Channel)
		return
	}
}

func main() {

	err := godotenv.Load(fmt.Sprintf(".env.%s", os.Getenv("GO_ENV")))
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var (
		Token   = flag.String("token", os.Getenv("DISCORD_TOKEN"), "Bot authentication token")
		App     = flag.String("app", os.Getenv("DISCORD_APPLICATIOIN_ID"), "Application ID")
		Guild   = flag.String("guild", os.Getenv("DISCORD_GUILD_ID"), "Guild ID")
		Channel = flag.String("channel", os.Getenv("DISCORD_CHANNEL_ID"), "Channel ID")
	)

	flag.Parse()
	if *App == "" {
		log.Fatal("application id is not set")
	}

	session, _ := discordgo.New("Bot " + *Token)

	session.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		log.Printf("Logged in as %s", r.User.String())
	})

	session.AddHandler(func(s *discordgo.Session, v *discordgo.VoiceStateUpdate) {
		handleVoiceStateUpdate(s, v, Guild, Channel)
	})

	err = session.Open()
	if err != nil {
		log.Fatalf("could not open session: %s", err)
	}

	sigch := make(chan os.Signal, 1)
	signal.Notify(sigch, os.Interrupt)
	<-sigch

	err = session.Close()
	if err != nil {
		log.Printf("could not close session gracefully: %s", err)
	}
}
