d=$(dirname "$1")
mkdir -p "app/$d"
touch "app/$1"
echo "app/$1"
