namespace :db do

  namespace :populate do

    desc "Populate db with fake data"
    task :all => :environment do
      generate_admin
      generate_user
      generate_list
    end

    desc "Populate db with fake admins"
    task :admin => :environment do
      generate_admin
    end



    desc "Populate db with fake lists"
    task :list => :environment do
      generate_list
    end

    desc "Populate db with fake users"
    task :user => :environment do
      generate_user
    end


    def generate_admin
      AdminUser.destroy_all
      AdminUser.create!(email: "tnbredillet@gmail.com", password: "wer0ckadm1n!")
      AdminUser.create!(email: "antoinedematteo@gmail.com", password: "wer0ckadm1n!")
      AdminUser.create!(email: "alexandre.bessis@gmail.com", password: "wer0ckadm1n!")
    end

    def generate_user
      User.destroy_all
      User.create!(nickname: "thomas", email: "tnbredillet@gmail.com", password: "wer0ckadm1n!", password_confirmation: "wer0ckadm1n!", firstname: "Thomas", lastname: "Bredillet")
      User.create!(nickname: "antoine", email: "antoinedematteo@gmail.com", password: "wer0ckadm1n!", password_confirmation: "wer0ckadm1n!", firstname: "Antoine", lastname: "Dematteo")
      User.create!(nickname: "alexandre", email: "alexandre.bessis@gmail.com", password: "wer0ckadm1n!", password_confirmation: "wer0ckadm1n!", firstname: "Alexandre", lastname: "Bessis")
      (1..25).each {|i| User.create!(email: Faker::Internet.email, password: "iamadumbuser!", password_confirmation: "iamadumbuser!", firstname: Faker::Name.name.split(" ").first, lastname: Faker::Name.name.split(" ").second)}
    end

    def generate_list
      List.destroy_all
      l = List.create!(name: "The first list!")
      User.all.each do |u|
       l.users << u
       generate_vote(l,u,u)
      end

      l.save
    end

    def generate_vote(list,user_to,user_from)
      Vote.create!(list_id: list.id, user_id: user_from.id, user_to_id: user_to.id, points: (1..15).to_a.sample)
    end


  end
end